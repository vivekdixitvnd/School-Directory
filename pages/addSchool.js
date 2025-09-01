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
      <div style={contentContainer}>
        <h1 style={title}>Add School</h1>
        <form onSubmit={handleSubmit(onSubmit)} style={form}>
        <input
          placeholder="School Name"
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          style={input}
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
        {errors.name && <span style={err}>{errors.name.message}</span>}

        <input
          placeholder="Address"
          {...register('address', { required: 'Address is required' })}
          style={input}
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
        {errors.address && <span style={err}>{errors.address.message}</span>}

        <input
          placeholder="City"
          {...register('city', { required: 'City is required' })}
          style={input}
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
        {errors.city && <span style={err}>{errors.city.message}</span>}

        <input
          placeholder="State"
          {...register('state', { required: 'State is required' })}
          style={input}
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
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
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
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
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
        {errors.email_id && <span style={err}>{errors.email_id.message}</span>}

        <input
          type="file"
          accept="image/*"
          {...register('image', { required: 'Image is required' })}
          style={fileInput}
          onFocus={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.6)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
        {errors.image && <span style={err}>{errors.image.message}</span>}

        <button 
          type="submit" 
          style={button}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
          }}
        >Save</button>
        {status && (
          <p style={statusMessage(status.type)}>
            {status.msg}
          </p>
        )}
        </form>
      </div>
    </div>
  );
}

const container = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const contentContainer = {
  maxWidth: '600px',
  width: '100%',
  textAlign: 'center',
  color: 'white',
};

const title = { 
  fontSize: 48, 
  marginBottom: 40, 
  textAlign: 'center',
  fontWeight: 700,
  color: 'white',
  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const form = {
  display: 'grid', 
  gap: 20,
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '40px',
  borderRadius: '24px',
  backdropFilter: 'blur(15px)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
};

const input = {
  padding: '16px 20px', 
  border: '2px solid rgba(255, 255, 255, 0.3)', 
  borderRadius: '16px', 
  fontSize: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  outline: 'none',
};

const fileInput = { 
  ...input, 
  padding: '12px 16px',
  cursor: 'pointer',
};

const button = {
  padding: '18px 32px', 
  border: 'none', 
  borderRadius: '16px', 
  fontSize: '18px', 
  cursor: 'pointer',
  background: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
};

const err = { 
  color: '#ff6b6b', 
  fontSize: '14px',
  fontWeight: '500',
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const statusMessage = (type) => ({
  marginTop: '20px',
  padding: '12px 20px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  background: type === 'success' 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(239, 68, 68, 0.2)',
  color: type === 'success' ? '#22c55e' : '#ef4444',
  border: `2px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
  backdropFilter: 'blur(10px)',
});
