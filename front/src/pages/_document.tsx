import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="assets/js/jquery.min.js" />
          <script src="assets/js/bootstrap.min.js" />
          <script src="assets/js/jquery.easing.min.js" />
          <script src="assets/js/swiper.min.js" />
          <script src="assets/js/jquery.magnific-popup.js" />
          <script src="assets/js/scripts.js" />
        </body>
      </Html>
    );
  }
}
