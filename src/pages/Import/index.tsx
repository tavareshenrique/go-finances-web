import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import api from '../../services/api';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import {
  Container,
  Title,
  ImportFileContainer,
  ErrorContainer,
  Error,
  Footer,
} from './styles';

import alert from '../../assets/alert.svg';
import error from '../../assets/error.svg';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const history = useHistory();

  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.forEach(uploadedFile => {
      data.append('file', uploadedFile.file);
    });

    try {
      await api.post('/transactions/import', data);
      setHasError(false);
      setErrorMessage('');
      history.push('/');
    } catch (err) {
      setHasError(true);
      setErrorMessage(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const formattedFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(formattedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          {hasError && (
            <ErrorContainer>
              <img src={error} alt="Error" />
              <Error>{errorMessage}</Error>
            </ErrorContainer>
          )}
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
