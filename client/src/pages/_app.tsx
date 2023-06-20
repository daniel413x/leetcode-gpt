import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <Head>
      <title>LeetClone</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
      <meta
        name="description"
        content="Web application that contains leetcode problems and video solutions"
      />
    </Head>
    <ToastContainer />
    <Component {...pageProps} />
  </RecoilRoot>
);

export default App;
