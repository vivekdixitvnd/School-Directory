'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  contact: z.string().min(7, 'Invalid contact'),
  email_id: z.string().email('Invalid email'),
  image: z.any().refine((f) => f && f.length === 1, 'Image required'),
});

export default function AddSchoolPage() {
  const [msg, setMsg] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (k !== 'image') formData.append(k, v);
    });
    formData.append('image', values.image[0]);

    const res = await fetch('/api/schools', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.ok) {
      setMsg('✅ School added!');
      reset();
    } else setMsg('❌ ' + data.error);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
        <input placeholder="School Name" {...register('name')} className="border p-2 w-full"/>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <input placeholder="Address" {...register('address')} className="border p-2 w-full"/>
        <input placeholder="City" {...register('city')} className="border p-2 w-full"/>
        <input placeholder="State" {...register('state')} className="border p-2 w-full"/>
        <input placeholder="Contact" {...register('contact')} className="border p-2 w-full"/>
        <input placeholder="Email" {...register('email_id')} className="border p-2 w-full"/>
        <input type="file" accept="image/*" {...register('image')} />
        <button className="bg-black text-white px-4 py-2">Save</button>
      </form>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
}
