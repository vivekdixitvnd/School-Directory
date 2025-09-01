import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("/api/schools")
      .then((res) => setSchools(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (school) => {
    setSelectedSchool(school);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSchool(null);
  };

  return (
    <div style={wrap}>
      <div style={contentContainer}>
        <h1 style={title}>Schools</h1>
        {loading ? (
          <p style={loadingText}>Loading…</p>
        ) : schools.length === 0 ? (
          <p style={noSchoolsText}>No schools found.</p>
        ) : (
          <div style={grid}>
          {schools.map((s) => (
            <div 
              key={s.id} 
              style={card}
              onClick={() => handleCardClick(s)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-16px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 32px 64px rgba(0,0,0,0.15), 0 16px 32px rgba(0,0,0,0.1)';
                e.currentTarget.style.background = 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)';
                e.currentTarget.style.background = 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)';
              }}
            >
              <div style={imageWrap}>
                <Image
                  src={s.image || "/placeholder.png"}
                  alt={s.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 240px"
                />
                <div style={imageOverlay}></div>
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
      
      {showModal && selectedSchool && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={modalTitle}>{selectedSchool.name}</h2>
              <button 
                style={closeButton} 
                onClick={closeModal}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >×</button>
            </div>
            
            <div style={modalBody}>
              <div style={modalImageWrap}>
                <Image
                  src={selectedSchool.image || "/placeholder.png"}
                  alt={selectedSchool.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              
              <div style={detailsGrid}>
                <div style={detailItem}>
                  <span style={detailItemStrong}>Address:</span>
                  <p style={detailItemP}>{selectedSchool.address}</p>
                </div>
                
                <div style={detailItem}>
                  <span style={detailItemStrong}>City:</span>
                  <p style={detailItemP}>{selectedSchool.city}</p>
                </div>
                
                <div style={detailItem}>
                  <span style={detailItemStrong}>State:</span>
                  <p style={detailItemP}>{selectedSchool.state}</p>
                </div>
                
                <div style={detailItem}>
                  <span style={detailItemStrong}>Contact:</span>
                  <p style={detailItemP}>{selectedSchool.contact}</p>
                </div>
                
                <div style={detailItem}>
                  <span style={detailItemStrong}>Email:</span>
                  <p style={detailItemP}>{selectedSchool.email_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const wrap = { 
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "20px",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const contentContainer = {
  maxWidth: "1200px",
  width: "100%",
  textAlign: "center",
  color: "white",
};
const title = { 
  fontSize: 48, 
  marginBottom: 40, 
  textAlign: "center",
  fontWeight: 700,
  color: "white",
  textShadow: "0 4px 8px rgba(0,0,0,0.3)",
  background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const loadingText = {
  fontSize: "20px",
  color: "white",
  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  opacity: "0.9",
};

const noSchoolsText = {
  fontSize: "20px",
  color: "white",
  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  opacity: "0.9",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 24,
};
const card = {
  border: "none",
  borderRadius: 24,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)",
  cursor: "pointer",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  transform: "translateY(0)",
};
const imageWrap = {
  position: "relative",
  width: "100%",
  height: 200,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  overflow: "hidden",
  borderBottom: "none",
};

const imageOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
  pointerEvents: "none",
};
const cardBody = { 
  padding: 28, 
  display: "grid", 
  gap: 18,
  flex: 1,
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
};
const name = { 
  fontSize: 28, 
  margin: 0, 
  fontWeight: 900,
  color: "#1a202c",
  lineHeight: 1.1,
  letterSpacing: "-0.8px",
};
const text = { 
  margin: 0, 
  color: "#718096",
  fontSize: 14,
  lineHeight: 1.5,
  fontWeight: 400,
};
const pill = {
  display: "inline-block",
  marginTop: 12,
  fontSize: 12,
  padding: "6px 12px",
  borderRadius: 20,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  width: "fit-content",
  fontWeight: 600,
  boxShadow: "0 4px 8px rgba(102, 126, 234, 0.3)",
  letterSpacing: "0.3px",
  textTransform: "uppercase",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 20,
  backdropFilter: "blur(4px)",
};

const modalContent = {
  backgroundColor: "white",
  borderRadius: 20,
  maxWidth: 700,
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 32px",
  borderBottom: "1px solid #f1f5f9",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "20px 20px 0 0",
};

const modalTitle = {
  margin: 0,
  fontSize: 28,
  fontWeight: 700,
  color: "white",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const closeButton = {
  background: "rgba(255, 255, 255, 0.2)",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
  color: "white",
  padding: 0,
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  transition: "all 0.2s ease",
  backdropFilter: "blur(10px)",
};

const modalBody = {
  padding: 32,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

const modalImageWrap = {
  position: "relative",
  width: "100%",
  height: 250,
  borderRadius: 16,
  overflow: "hidden",
  marginBottom: 32,
  background: "rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
};

const detailsGrid = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const detailItem = {
  padding: 20,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  transition: "all 0.2s ease",
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(10px)",
};

const detailItemStrong = {
  display: "block",
  fontWeight: 600,
  color: "white",
  marginBottom: 8,
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "1px",
  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const detailItemP = {
  margin: 0,
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: 16,
  lineHeight: 1.6,
  fontWeight: 500,
  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
};
