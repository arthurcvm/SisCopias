import type { AppProps } from 'next/app';
import '../assets/css/bootstrap.css';
import '../assets/css/fontawesome-all.css';
import '../assets/css/swiper.css';
import '../assets/css/magnific-popup.css';
import '../assets/css/styles.css';
import { AuthContextProvider } from '../contexts/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
export default MyApp;
