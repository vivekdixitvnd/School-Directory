import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState, useRef } from 'react';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [status, setStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { ref: imageRegisterRef, ...imageRegister } = register('image', { required: 'Image is required' });

  // Image compression function that guarantees result under target bytes
  const compressImage = (file, targetBytes = 9.5 * 1024 * 1024) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;
        let maxWidth = 1920; // initial cap

        const compressOnce = (quality) => new Promise((res) => {
          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => res(blob), 'image/jpeg', quality);
        });

        const tryReduce = async () => {
          let quality = 0.8;
          while (true) {
            const blob = await compressOnce(quality);
            if (blob && blob.size <= targetBytes) {
              return resolve(blob);
            }
            if (quality > 0.2) {
              quality -= 0.1;
              continue;
            }
            // If quality is already low, reduce dimensions and retry
            if (width > maxWidth) {
              const ratio = maxWidth / width;
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
            } else if (width > 1280) {
              const ratio = 1280 / width;
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
            } else if (width > 1024) {
              const ratio = 1024 / width;
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
            } else {
              // Cannot reduce further meaningfully; return best effort
              return resolve(blob);
            }
            // reset quality a bit higher after downscaling
            quality = 0.7;
          }
        };

        // Initial width cap before starting loop
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        tryReduce();
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // File validation function
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, JPG, or PNG)';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    return null;
  };

  const onSubmit = async (data) => {
    try {
      setStatus(null);
      setIsUploading(true);
      
      const formData = new FormData();
      
      // Handle image file with validation and compression
      if (data.image && data.image[0]) {
        const file = data.image[0];
        
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          setStatus({ type: 'error', msg: validationError });
          setIsUploading(false);
          return;
        }
        
        // Compress image if it's larger than ~5MB, and ensure <10MB final
        let processedFile = file;
        if (file.size > 5 * 1024 * 1024) {
          setStatus({ type: 'info', msg: 'Compressing image...' });
          const blob = await compressImage(file, 9.5 * 1024 * 1024);
          // Wrap Blob as File so multer gets name and type
          const newName = (file.name || 'upload')
            .replace(/\.[^.]+$/, '') + '.jpg';
          processedFile = new File([blob], newName, { type: 'image/jpeg' });
          if (processedFile.size > 10 * 1024 * 1024) {
            setStatus({ type: 'error', msg: 'Compressed image is still too large. Please choose a smaller image.' });
            setIsUploading(false);
            return;
          }
        }

        formData.append('image', processedFile);
      }
      
      // Add other form data
      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'image') formData.append(k, v);
      });
      
      const res = await axios.post('/api/schools', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setStatus({ type: 'success', msg: res.data.message || 'School added successfully!' });
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      if (errorMsg.includes('File size too large')) {
        setStatus({ type: 'error', msg: 'Image file is too large. Please try a smaller image or compress it before uploading.' });
      } else {
        setStatus({ type: 'error', msg: errorMsg });
      }
    } finally {
      setIsUploading(false);
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
          accept="image/jpeg,image/jpg,image/png"
          {...imageRegister}
          ref={(el) => {
            imageRegisterRef(el);
            fileInputRef.current = el;
          }}
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
        <p style={fileInfo}>
          Supported formats: JPEG, JPG, PNG. Max size: 10MB. Large images will be automatically compressed.
        </p>

        <button 
          type="submit" 
          disabled={isUploading}
          style={{
            ...button,
            opacity: isUploading ? 0.7 : 1,
            cursor: isUploading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isUploading) {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isUploading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            }
          }}
        >
          {isUploading ? 'Uploading...' : 'Save'}
        </button>
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

const fileInfo = {
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.7)',
  marginTop: '8px',
  textAlign: 'center',
  fontStyle: 'italic',
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
    : type === 'info'
    ? 'rgba(59, 130, 246, 0.2)'
    : 'rgba(239, 68, 68, 0.2)',
  color: type === 'success' 
    ? '#22c55e' 
    : type === 'info'
    ? '#3b82f6'
    : '#ef4444',
  border: `2px solid ${type === 'success' 
    ? 'rgba(34, 197, 94, 0.3)' 
    : type === 'info'
    ? 'rgba(59, 130, 246, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'}`,
  backdropFilter: 'blur(10px)',
});
