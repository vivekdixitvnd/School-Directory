import Link from "next/link";

export default function Home() {
  return (
    <div style={container}>
      <div style={heroSection}>
        <div style={content}>
          <h1 style={mainTitle}>Welcome to School Directory</h1>
          <p style={subtitle}>
            Discover and manage schools with our comprehensive directory system. 
            Add new schools or browse through our extensive collection.
          </p>
          
          <div style={buttonContainer}>
            <Link href="/addSchool" style={buttonLink}>
              <div 
                style={primaryButton}
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
              >
                <span style={buttonIcon}>+</span>
                Add New School
              </div>
            </Link>
            
            <Link href="/showSchools" style={buttonLink}>
              <div 
                style={secondaryButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                }}
              >
                <span style={buttonIcon}>🏫</span>
                Browse Schools
              </div>
            </Link>
          </div>
        </div>
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

const heroSection = {
  maxWidth: '1200px',
  width: '100%',
  textAlign: 'center',
  color: 'white',
};

const content = {
  marginBottom: '80px',
};

const mainTitle = {
  fontSize: '48px',
  fontWeight: '700',
  marginBottom: '20px',
  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  lineHeight: '1.2',
};

const subtitle = {
  fontSize: '20px',
  marginBottom: '40px',
  opacity: '0.9',
  lineHeight: '1.6',
  maxWidth: '600px',
  margin: '0 auto 40px auto',
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const buttonContainer = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: '40px',
};

const buttonLink = {
  textDecoration: 'none',
  color: 'inherit',
};

const primaryButton = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 32px',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '50px',
  color: 'white',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
};

const secondaryButton = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 32px',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '50px',
  color: 'white',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
};

const buttonIcon = {
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


