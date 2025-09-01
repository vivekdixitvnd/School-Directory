// pages/showSchools.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/schools')
      .then(res => setSchools(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={wrap}>
      <h1 style={title}>Schools</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={grid}>
          {schools.map((s) => (
            <div key={s.id} style={card}>
              <div style={imageWrap}>
                <img
                  src={s.image || '/placeholder.png'}
                  alt={s.name}
                  style={img}
                />
              </div>
              <div style={cardBody}>
                <h3 style={name}>{s.name}</h3>
                <p style={text}>{s.address}</p>
                <p style={pill}>{s.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const wrap = { maxWidth: 1100, margin: '0 auto', padding: 16 };
const title = { fontSize: 28, marginBottom: 16, textAlign: 'center' };
const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 16,
};
const card = {
  border: '1px solid #eee', borderRadius: 12, overflow: 'hidden',
  display: 'flex', flexDirection: 'column', background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,.05)',
};
const imageWrap = { width: '100%', height: 160, overflow: 'hidden', background: '#f8f8f8' };
const img = { width: '100%', height: '100%', objectFit: 'cover' };
const cardBody = { padding: 12, display: 'grid', gap: 6 };
const name = { fontSize: 18, margin: 0 };
const text = { margin: 0, color: '#555' };
const pill = {
  display: 'inline-block', marginTop: 4, fontSize: 12, padding: '4px 8px',
  borderRadius: 999, background: '#eef2ff', color: '#3730a3', width: 'fit-content',
};
