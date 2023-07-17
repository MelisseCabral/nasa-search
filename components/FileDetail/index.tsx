import { Dialog, Transition } from '@headlessui/react';
import React, { HTMLAttributes, PropsWithChildren, useState } from 'react';
import Typography from '../Typography';
import { ImageSelected } from '@/interfaces/ImageSelected';
import Button from '../Button';
import Image from 'next/image'
import { data } from 'autoprefixer';

interface IFileDetail extends PropsWithChildren<HTMLAttributes<HTMLButtonElement>> {
  selected: ImageSelected | undefined
  isOpen: boolean;
  onClose: () => void;
}

export default function FileDetail({ isOpen, selected, onClose }: IFileDetail) {

  const date = selected ? new Date(selected?.data?.date_created?.toString()) : '';

  const formattedDate = date instanceof Date ? date.toLocaleDateString() : '';


  async function downloadImage() {
    
    if(selected) {
      const response = await fetch(selected?.thumbnails);
    
      const blobImage = await response.blob();
    
      const href = URL.createObjectURL(blobImage);
    
      const anchorElement = document.createElement('a');
      anchorElement.href = href;
      anchorElement.download = `${selected?.data?.nasa_id}.png`;
    
      document.body.appendChild(anchorElement);
      anchorElement.click();
    
      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    }
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
      open={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-center h-screen w-screen max-h-screen overflow-auto bg-indigo">
        {selected?.data && (
          <div className=" text-white shadow-xl h-screen w-screen">
            <div className="w-full border-b border-indigo">
              <div className="justify-between flex w-full ">
                <div className="flex flex-col pl-4 py-4">
                  <Typography variant="regular3">{selected.data.title}</Typography>
                  <Typography variant="light5" className="text-gray-300">By: {selected.data.photographer || 'Unknown'} | Location: {selected.data.location} </Typography>
                </div>
                <div className='flex flex-row justify-center items-center'>
                  <Button onClick={downloadImage} className="text-pink-800 font-regular px-4 justify-center flex flex-row gap-4 bg-pink-300 py-2 mr-3 rounded-md" label={''}>
                    <Image 
                      src="/download-icon.svg"
                      width={16}
                      height={16}
                      alt="Search Logo"
                      className="m-auto"
                    />
                    Download
                  </Button>
                  <Button className="bg-transparent text-white px-6 justify-center items-center border-l border-indigo h-[100%]" label={''}>
                    <Image 
                      src="/close-icon.svg"
                      width={16}
                      height={16}
                      alt="Search Logo"
                      className="m-auto"
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className='py-8'>
              <div className="relative h-[60vh] w-[70vw] m-auto mt-4">
                <Image alt="" layout='fill' objectFit="cover" src={selected.thumbnails} className="rounded-md"/>
              </div>
              <div className='w-[70vw] m-auto mt-4 border-b border-indigo'>
                <Typography variant='regular3'>Information</Typography>
              </div>
              <div className='w-[70vw] m-auto mt-4 border-b border-indigo justify-between flex'>
                <Typography variant='regular5' className='text-gray-300'>Created By</Typography>
                <Typography variant='regular5' >{selected.data.photographer}</Typography>
              </div>
              <div className='w-[70vw] m-auto mt-4 border-b border-indigo justify-between flex'>
                <Typography variant='regular5' className='text-gray-300'>Date created</Typography>
                <Typography variant='regular5' >{formattedDate || 'Unknown'}</Typography>
              </div>
              <div className='w-[70vw] m-auto mt-4 flex flex-col'>
                <Typography variant='light4'>Description</Typography>
                <Typography variant='light5'>{selected.data.description}</Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
