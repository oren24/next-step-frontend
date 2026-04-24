import {useState} from 'react';
import {buildEditFormData} from '../helpers/jobDrawerMappers';

const EMPTY_EDIT_FORM = {
  position: '',
  company: '',
  location: '',
  workType: '',
  jobUrl: '',
  platform: '',
  tags: '',
};

export default function useJobDrawerState(app) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteValue, setNoteValue] = useState(app?.note || app?.notes || '');
  const [editFormData, setEditFormData] = useState(app ? buildEditFormData(app) : EMPTY_EDIT_FORM);

  const handleToggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleFormChange = (event) => {
    const {name, value} = event.target;
    setEditFormData((prevData) => ({...prevData, [name]: value}));
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData(buildEditFormData(app));
  };

  return {
    isEditMode,
    noteValue,
    editFormData,
    setIsEditMode,
    setNoteValue,
    handleToggleEditMode,
    handleFormChange,
    handleCancelEdit,
  };
}



