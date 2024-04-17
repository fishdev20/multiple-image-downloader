'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const FormSchema = z.object({
  urls: z
    .string()
    .min(10, {
      message: 'Please, type valid urls',
    })
    .max(10000, {
      message: 'Exceeded the maximum',
    }),
});

export default function DownloadForm() {
  const [textareaValue, setTextareaValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    if (!textareaValue.trim()) {
      setError('urls', {
        type: 'manual',
        message: 'Textarea cannot be empty',
      });
      return;
    }
    let arr: string[] = [];

    try {
      arr = data.urls
        .trim()
        .replaceAll("'", '')
        .replaceAll('"', '')
        .replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll('\n', ',')
        .replaceAll(';', ',')
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n);
    } catch (e) {
      setError('urls', { message: 'Download failed, check your urls again!' });
      return;
    }

    arr = Array.from(new Set(arr));

    downloadAllImages(arr)
      .then(() => {
        setIsLoading(false);
        toast.success('Download successfully', { position: 'bottom-center' });
      })
      .catch((e) => {
        toast.error('Failed to download', { position: 'bottom-center' });
        console.log('error', e);
        setIsLoading(false);
        setError('urls', { message: 'Download failed, check your urls again!' });
      });
  }

  const imageUrlToBase64 = async (url: string) => {
    const data = await fetch(url);
    if (!data.ok) {
      throw new Error('Failed to fetch image');
    }
    if (data.status === 404) {
      throw new Error('Url Not Found');
    }
    const blob = await data.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  };

  async function downloadAllImages(image_urls: string[]) {
    const zip = new JSZip();
    for (let i = 0; i < image_urls.length; i++) {
      console.log(image_urls[i]);
      if (!Boolean(new URL(image_urls[i]))) {
        throw new Error('Invalid Urls');
      }
      const file: any = await imageUrlToBase64(image_urls[i]);

      zip.file(`image_${i}.png`, file.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), {
        base64: true,
      });
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'images.zip');
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" w-full max-w-[1280px]  p-5">
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        Your image urls
      </label>
      <textarea
        rows={4}
        {...register('urls')}
        className="w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Enter image URLs, one per line"
        value={textareaValue}
        onChange={handleTextareaChange}
      ></textarea>
      {errors.urls?.message && <p className="text-red-500">{errors.urls.message}</p>}
      <button
        className={` w-full rounded-md px-4 py-2 focus:outline-none ${
          !textareaValue.trim()
            ? 'cursor-not-allowed bg-blue-400 text-gray-200'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        // onClick={handleDownload}
        disabled={!textareaValue.trim()}
      >
        {isLoading ? 'Downloading...' : 'Download images'}
      </button>
    </form>
  );
}
