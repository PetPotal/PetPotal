import React, { ChangeEventHandler } from 'react';
import style from './FileUploadButton.module.css';

interface propsData {
  onLoadFileHandler: Function;
}

const FileUploadButton = (props:propsData) => {
  const {onLoadFileHandler} = props;

  return (
    <div className={style.filebox}>
      <label htmlFor="fileUploadButton">사진 업로드</label>
      <input type="file" id="fileUploadButton" accept="image/*" multiple onChange={onLoadFileHandler as ChangeEventHandler<HTMLInputElement>} />
    </div>
  )
}

export default React.memo(FileUploadButton);