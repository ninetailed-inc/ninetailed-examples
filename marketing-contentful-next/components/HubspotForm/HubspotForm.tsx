import { useNinetailed, useProfile } from '@ninetailed/experience.js-next';
import { IHubspotForm } from '@/types/contentful';
import { useForm, SubmitHandler } from 'react-hook-form';
import { handleErrors } from '@/lib/helperfunctions';

type FormValues = {
  firstname: string;
  lastname: string;
  companyname: string;
  companysize: string;
  email: string;
  ninetailedid: string;
};

export const HubspotForm: React.FC<IHubspotForm> = ({ fields }) => {
  const { profile } = useProfile();
  const { identify } = useNinetailed();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = handleErrors(
    async (data) => {
      await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${fields.hubspotPortalId}/${fields.hubspotFormId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: [
              {
                objectTypeId: '0-1',
                name: 'firstname',
                value: data.firstname,
              },
              {
                objectTypeId: '0-1',
                name: 'lastname',
                value: data.lastname,
              },
              {
                objectTypeId: '0-2',
                name: 'name',
                value: data.companyname,
              },
              {
                objectTypeId: '0-1',
                name: 'companysize',
                value: data.companysize,
              },
              {
                objectTypeId: '0-1',
                name: 'email',
                value: data.email,
              },
              {
                objectTypeId: '0-1',
                name: 'ninetailedid',
                value: data.ninetailedid,
              },
            ],
          }),
        }
      );
      // eslint-disable-next-line
      const { ninetailedid, ...traitData } = data;
      await identify('', traitData);
    }
  );

  return (
    <div className="mx-auto max-w-md -mt-10 px-4 sm:max-w-3xl sm:px-6 lg:px-12 lg:max-w-7xl">
      {profile && (
        <form
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          className="flex flex-col space-y-4 items-start"
        >
          <fieldset className="flex flex-row w-full gap-4 flex-wrap">
            <div className="flex flex-col flex-1">
              <label htmlFor="firstname" className="text-lg">
                First Name
              </label>
              <input
                id="firstname"
                className="border-2 h-10 px-3 rounded focus:outline-amber-500 border-indigo-300"
                {...register('firstname', { required: true })}
              />
              {errors.firstname && (
                <p className="text-orange-500 text-sm">
                  First name is required.
                </p>
              )}
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="lastname" className="text-lg">
                Last Name
              </label>
              <input
                id="lastname"
                className="border-2 h-10 px-3 rounded focus:outline-amber-500 border-indigo-300"
                {...register('lastname', { required: true })}
              />
              {errors.lastname && (
                <p className="text-orange-500 text-sm">
                  Last name is required.
                </p>
              )}
            </div>
          </fieldset>
          <fieldset className="flex flex-col w-full">
            <label htmlFor="companyname" className="text-lg">
              Company Name
            </label>
            <input
              id="companyname"
              className="border-2 h-10 px-3 rounded focus:outline-amber-500 border-indigo-300"
              {...register('companyname', { required: true })}
            />
            {errors.companyname && (
              <p className="text-orange-500 text-sm">
                Company name is required.
              </p>
            )}
          </fieldset>
          <fieldset className="flex flex-col w-full">
            <label htmlFor="companysize" className="text-lg">
              Company Size
            </label>
            <select
              id="companysize"
              className="border-2 h-10 px-3 rounded focus:outline-amber-500 border-indigo-300"
              {...register('companysize', { required: true })}
              defaultValue=""
            >
              <option disabled value="">
                Please Select
              </option>
              <option value="1-50">1-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000-2000">1000-2000</option>
              <option value="more_than_2000">More than 2000</option>
            </select>
            {errors.companysize && (
              <p className="text-orange-500 text-sm">
                Company size is required.
              </p>
            )}
          </fieldset>
          <fieldset className="flex flex-col w-full">
            <label htmlFor="email" className="text-lg">
              Business Email
            </label>
            <input
              id="email"
              className="border-2 h-10 px-3 rounded focus:outline-amber-500 border-indigo-300"
              {...register('email', {
                required: true,
                pattern:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              })}
            />
            {errors.email && (
              <p className="text-orange-500 text-sm">Email is required.</p>
            )}
          </fieldset>
          <input
            id="ninetailedid"
            className="hidden"
            {...register('ninetailedid', {
              required: true,
              value: profile.id,
            })}
          />
          <input
            type="submit"
            className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
          />
        </form>
      )}
    </div>
  );
};
