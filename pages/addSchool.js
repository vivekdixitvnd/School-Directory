// pages/addSchool.jsx
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    try {
      setStatus(null);
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'image') formData.append('image', v[0]);
        else formData.append(k, v);
      });
      const res = await axios.post('/api/schools', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus({ type: 'success', msg: res.data.message || 'Added!' });
      reset();
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || err.message });
    }
  };

  return (
    <div style={container}>
      <h1 style={title}>Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={form}>
        <input
          placeholder="School Name"
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          style={input}
        />
        {errors.name && <span style={err}>{errors.name.message}</span>}

        <input
          placeholder="Address"
          {...register('address', { required: 'Address is required' })}
          style={input}
        />
        {errors.address && <span style={err}>{errors.address.message}</span>}

        <input
          placeholder="City"
          {...register('city', { required: 'City is required' })}
          style={input}
        />
        {errors.city && <span style={err}>{errors.city.message}</span>}

        <input
          placeholder="State"
          {...register('state', { required: 'State is required' })}
          style={input}
        />
        {errors.state && <span style={err}>{errors.state.message}</span>}

        <input
          placeholder="Contact Number"
          type="number"
          {...register('contact', {
            required: 'Contact is required',
            minLength: { value: 10, message: 'Min 10 digits' },
          })}
          style={input}
        />
        {errors.contact && <span style={err}>{errors.contact.message}</span>}

        <input
          placeholder="Email"
          type="email"
          {...register('email_id', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
          style={input}
        />
        {errors.email_id && <span style={err}>{errors.email_id.message}</span>}

        <input
          type="file"
          accept="image/*"
          {...register('image', { required: 'Image is required' })}
          style={fileInput}
        />
        {errors.image && <span style={err}>{errors.image.message}</span>}

        <button type="submit" style={button}>Save</button>
        {status && (
          <p style={{ marginTop: 10, color: status.type === 'success' ? 'green' : 'crimson' }}>
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}

const container = {
  maxWidth: 640, margin: '0 auto', padding: 16,
};
const title = { fontSize: 28, marginBottom: 16, textAlign: 'center' };
const form = {
  display: 'grid', gap: 12,
};
const input = {
  padding: 10, border: '1px solid #ddd', borderRadius: 8, fontSize: 16,
};
const fileInput = { ...input, padding: 6 };
const button = {
  padding: 12, border: 0, borderRadius: 10, fontSize: 16, cursor: 'pointer',
  background: '#2563eb', color: 'white',
};
const err = { color: 'crimson', fontSize: 13 };
