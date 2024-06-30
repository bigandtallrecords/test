import React, { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';

function App() {
  const [files, setFiles] = useState([]);
  const [albumImage, setAlbumImage] = useState('');

  useEffect(() => {
    async function listFiles() {
      try {
        const result = await Storage.list('YOUR_FOLDER_NAME/'); // Specify your folder name here
        const sortedFiles = result.sort((a, b) => a.key.localeCompare(b.key));
        const albumImg = sortedFiles.find(file => file.key.endsWith('album.png'));
        if (albumImg) {
          const albumImageUrl = await Storage.get(albumImg.key);
          setAlbumImage(albumImageUrl);
        }
        const mediaFiles = sortedFiles.filter(file => !file.key.endsWith('album.png'));
        setFiles(mediaFiles);
      } catch (err) {
        console.error('Error listing files:', err);
      }
    }

    listFiles();
    const interval = setInterval(listFiles, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>S3 Bucket Contents</h1>
      {albumImage && <img src={albumImage} alt="Album" style={{ width: '300px' }} />}
      <ul>
        {files.map(file => (
          <li key={file.key}>{file.key.split('/').pop()}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
