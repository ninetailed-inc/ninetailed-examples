import { Head, Html, Main, NextScript } from 'next/document';
import { Document, PreviewModeScript } from '@makeswift/runtime/next';
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <PreviewModeScript isPreview={this.props.__NEXT_DATA__.isPreview} />
        </Head>
        <body className="loading">
          <noscript>
            <iframe
              title="GTM"
              src={`https://www.googletagmanager.com/ns.html?id=${
                process.env.NEXT_PUBLIC_GTM_ID || ''
              }`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
