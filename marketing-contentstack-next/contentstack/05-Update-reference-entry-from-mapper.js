const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { validateRegex, sanitizePath } = require('@contentstack/cli-utilities');

module.exports = async ({
  migration,
  stackSDKInstance,
  managementAPIClient,
  config,
}) => {
  const modules = ['entries', 'assets', 'extensions', 'marketplace_apps'];

  const readAllModulesUids = (filePath) => {
    let uidMapping = {};

    modules.forEach((module) => {
      const mappingFilePath = path.join(
        sanitizePath(filePath),
        'mapper',
        sanitizePath(module),
        'uid-mapping.json'
      );
      if (fs.existsSync(mappingFilePath)) {
        const mappedIds = JSON.parse(
          fs.readFileSync(sanitizePath(mappingFilePath), 'utf-8')
        );

        if (module === 'marketplace_apps') {
          Object.values(mappedIds).forEach((ids) =>
            Object.assign(uidMapping, ids)
          );
        } else {
          Object.assign(uidMapping, sanitizeObject(mappedIds));
        }
      }
    });

    return uidMapping;
  };

  const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  };

  const getEntries = async (ct) => {
    try {
      let entries = [];
      let skip = 0;
      let limit = 100;
      let count = 0;
      while (skip <= count) {
        const res = await stackSDKInstance
          .contentType(ct)
          .entry()
          .query({ include_count: true, skip, limit })
          .find();
        count = res.count;
        skip += limit;
        entries.push(...res.items);
      }
      return entries;
    } catch (err) {
      console.log(chalk.red(`Failed to fetch the entries...`));
      throw err;
    }
  };

  const getContentTypeSchema = async (ct) => {
    try {
      return await stackSDKInstance.contentType(ct).fetch();
    } catch (err) {
      console.log(
        chalk.red(
          `Failed to fetch the Content Type '${ct}' due to ${err.errorMessage}`
        )
      );
    }
  };

  const findAllEntriesUid = (stringifiedEntry) => {
    let pattern = /\bblt\w*/g;
    let matches = stringifiedEntry.match(pattern);
    return matches;
  };

  const replaceEntriesWithUpdatedUids = (
    matches,
    uidMapping,
    stringifiedEntry
  ) => {
    let isUpdated = false;
    let oldUids = Object.keys(uidMapping);
    matches.forEach((m) => {
      if (oldUids.includes(m)) {
        let regex = new RegExp(m, 'g');
        let { status } = validateRegex(regex);
        if (status === 'safe') {
          stringifiedEntry = stringifiedEntry.replace(regex, uidMapping[m]);
          console.log(
            chalk.green(`Replacing the UID '${m}' with '${uidMapping[m]}'...`)
          );
          isUpdated = true;
        }
      }
    });
    return { stringifiedEntry, isUpdated };
  };

  const updateEntryTask = () => {
    return {
      title: 'Update Reference Entries from Mapper',
      successMessage: 'Reference Updated Successfully',
      failedMessage: 'Failed to Update References in Entries',
      task: async (params) => {
        try {
          const log = console.log;

          if (
            (!config.contentTypes && !Array.isArray(config.contentTypes)) ||
            !config['mapper-path']
          ) {
            throw Error(
              `Missing Content Type or mapper path in config! Please make sure to have the Content Type [in Array] and the mapper path in config.`
            );
          }

          for (let ct of config.contentTypes) {
            let { schema: ctSchema } = (await getContentTypeSchema(ct)) ?? {};

            if (!ctSchema) {
              continue;
            }

            let keys = ctSchema?.map((schema) => {
              return schema.uid;
            });

            let entry = (await getEntries(ct)) ?? [];

            if (entry.length === 0) {
              log(chalk.red(`No entry found for the CT Content-type '${ct}'`));
              continue;
            }
            let uidMapping = readAllModulesUids(config['mapper-path']);

            for (let e of entry) {
              let isUpdated = false;

              let stringEntry = JSON.stringify(e);

              let matches = findAllEntriesUid(stringEntry);

              let res = replaceEntriesWithUpdatedUids(
                matches,
                uidMapping,
                stringEntry
              );

              stringEntry = res.stringifiedEntry;
              isUpdated = res.isUpdated;

              stringEntry = JSON.parse(stringEntry);

              keys.forEach((k) => {
                if (stringEntry[k]) {
                  e[k] = stringEntry[k];
                }
              });

              if (isUpdated) {
                await e.update(e.locale);

                log(
                  chalk.green(
                    `Successfully updated the references in the entry with UID '${e.uid}' and title '${e.title}'  of Content Type '${ct}' in Locale '${e.locale}'`
                  )
                );
              } else {
                log(
                  chalk.red(
                    `Failed to update the references in the entry with UID '${e.uid}' and title '${e.title}' of Content Type '${ct}' in Locale '${e.locale}'`
                  )
                );
              }
            }
            log(
              chalk.green(
                `Successfully updated the references in the entries of Content Type '${ct}'`
              )
            );
          }
        } catch (err) {
          if (err.request?.headers) {
            delete err.request['headers'];
          }
          console.log(chalk.red(`Failed to update references...`));
          throw err;
        }
      },
    };
  };

  migration.addTask(updateEntryTask());
};
