export default function TestPage() {
  return (
    <div style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h1>CSS Test Page</h1>
      
      <div style={{ 
        backgroundColor: 'red', 
        padding: '20px', 
        margin: '20px 0',
        border: '2px solid white'
      }}>
        <h2>Red Box Test</h2>
        <p>If you can see this red box with white text, basic CSS is working.</p>
      </div>
      
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        margin: '20px 0',
        border: '2px solid white',
        borderRadius: '8px'
      }}>
        <h2>Dark Box Test</h2>
        <p>This should look like your content tiles.</p>
      </div>
      
      <div style={{ 
        backgroundColor: '#3b82f6', 
        color: 'white',
        padding: '15px 30px', 
        margin: '20px 0',
        borderRadius: '8px',
        display: 'inline-block'
      }}>
        Blue Button Test
      </div>
      
      <div style={{ 
        backgroundColor: 'transparent', 
        color: 'white',
        padding: '15px 30px', 
        margin: '20px 0',
        borderRadius: '8px',
        border: '2px solid white',
        display: 'inline-block'
      }}>
        Outline Button Test
      </div>
    </div>
  );
}
