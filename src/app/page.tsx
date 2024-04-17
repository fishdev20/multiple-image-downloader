import { Toaster } from 'react-hot-toast';
import DownloadForm from './components/DownloadForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="p-5 text-3xl">Download multiple images</h1>
      <DownloadForm />
      <Toaster />
    </main>
  );
}
