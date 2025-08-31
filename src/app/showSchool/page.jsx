'use client';

import { useEffect, useState } from 'react';

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetch('/api/schools')
      .then((r) => r.json())
      .then((d) => setSchools(d.data || []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Schools</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {schools.map((s) => (
          <div key={s.id} className="border rounded-lg overflow-hidden">
            <img src={s.image} alt={s.name} className="w-full h-40 object-cover"/>
            <div className="p-2">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm">{s.address}</p>
              <p className="text-sm font-medium">{s.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
