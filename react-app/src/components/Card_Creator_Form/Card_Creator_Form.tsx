import { APISingleCharacterInterface } from '../../data/API_Interface';
import React, { useState } from 'react';
import { Card } from '../Card/Card';
import { ValidationMessage } from '../Validation_Message/Validation_Message';
import { RootState, setCards, setLastCardId } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FileUploader } from 'components/FileUploader/FileUploader';

import './CardCreatorForm.scss';

const defaultFormValues: APISingleCharacterInterface = {
  id: 0,
  name: '',
  status: '',
  species: '',
  type: '',
  gender: '',
  origin: {
    name: '',
    url: '',
  },
  location: {
    name: '',
    url: '',
  },
  image: '',
  episode: ['', ''],
  url: '',
  created: '',
};

export function CardCreatorForm() {
  const [isSubmitDone, setIsSubmitDone] = useState(false);

  const cards = useSelector((state: RootState) => state.cards);
  const lastCardId = useSelector((state: RootState) => state.lastCardId);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<APISingleCharacterInterface>();

  const [fileReview, setFileReview] = useState('');

  const onSubmitHandler: SubmitHandler<APISingleCharacterInterface> = (cardInformation) => {
    dispatch(
      setCards([
        ...cards,
        {
          ...defaultFormValues,
          name: cardInformation.name,
          status: cardInformation.status,
          species: cardInformation.species,
          type: cardInformation.type,
          gender: cardInformation.gender,
          image: fileReview,
          id: lastCardId,
        },
      ])
    );
    dispatch(setLastCardId(lastCardId + 1));
    setIsSubmitDone(true);
    setTimeout(() => {
      setIsSubmitDone(false);
    }, 2000);
    reset();
  };

  const handleUpload = (event: React.FormEvent<HTMLInputElement>): void => {
    if (event.currentTarget.files) {
      setFileReview(URL.createObjectURL(event.currentTarget.files[0]));
    }
  };

  return (
    <form className="card-creator-form" onSubmit={handleSubmit(onSubmitHandler)}>
      <label className="card-creator-form__name input-element">
        Name:
        <input
          {...register('name', { required: true })}
          type="text"
          className="input-element__input"
          placeholder={'Name...'}
        />
      </label>
      {errors.name && <ValidationMessage className="input-element" message="Incorrect value" />}
      <label className="card-creator-form__status input-element">
        Status:
        <input
          {...register('status', { required: true })}
          type="text"
          className="input-element__input"
          placeholder={'Status...'}
        />
      </label>
      {errors.status && <ValidationMessage className="input-element" message="Incorrect value" />}
      <label className="card-creator-form__species input-element">
        Species:
        <input
          {...register('species', { required: true })}
          type="text"
          className="input-element__input"
          placeholder={'Species...'}
        />
      </label>
      {errors.species && <ValidationMessage className="input-element" message="Incorrect value" />}
      <label className="card-creator-form__type input-element">
        Type:
        <input
          {...register('type', { required: true })}
          type="text"
          className="input-element__input"
          placeholder={'Type...'}
        />
      </label>
      {errors.type && <ValidationMessage className="input-element" message="Incorrect value" />}
      <label className="card-creator-form__gender input-element">
        Gender:
        <select {...register('gender')} className="input-element__select" placeholder="Gender...">
          <option value="Unknown">Unknown</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </label>
      <FileUploader handleUpload={handleUpload} file={fileReview} />
      {isSubmitDone && (
        <ValidationMessage
          className="input-element"
          message="Card has been created!"
          isPositive={true}
        />
      )}
      <button
        className="card-creator-form__submit-button"
        type="submit"
        disabled={!isDirty || !isValid}
      >
        Create character
      </button>
      <div className="cards-wrapper">
        {cards.length !== 0 && cards.map((element) => <Card key={element.id} info={element} />)}
      </div>
    </form>
  );
}
