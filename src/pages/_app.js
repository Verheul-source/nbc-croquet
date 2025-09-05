import '../styles/globals.css'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  return (
    <Layout currentPageName={Component.displayName || Component.name || 'Home'}>
      <Component {...pageProps} />
    </Layout>
  )
}