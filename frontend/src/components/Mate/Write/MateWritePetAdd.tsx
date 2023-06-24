import React, { MouseEventHandler } from 'react'
import style from './MateWritePetAdd.module.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import Controller from '../../../api/controller';
import { useConfirm } from '../../../hooks/useConfirm';
import { useAlert } from '../../../hooks/useAlert';

interface MateWritePetAddInterface {
  onClose: Function;
}

interface MateWritePetAddFormInput {
  animalsName: String;
  animalsGender: String;
  animalsAge: String;
  animalsCategory1: String;
  animalsCategory2: String;
  animalsWeight: Number;
  animalsNeutered: String;
}

export default function MateWritePetAdd(props:MateWritePetAddInterface) {
  const { onClose } = props;
  const { register, setValue, watch, getValues, formState: { errors }, setError, handleSubmit} = useForm<MateWritePetAddFormInput>({mode: 'onChange'});
  const controller = new Controller();
  const { openConfirm, closeConfirm } = useConfirm();
  const { openAlert } = useAlert();

  const onSubmit : SubmitHandler<MateWritePetAddFormInput> = async (data) => {
    if((getValues('animalsAge').includes('선택'))) {
      setError('animalsAge', {message: '나이를 선택해주세요'}, {shouldFocus: true });
      return ;
    }

    if((getValues('animalsCategory1').includes('선택'))) {
      setError('animalsCategory1', {message: '종류를 선택해주세요'}, {shouldFocus: true });
      return ;
    }

    console.log('data : ', data);


    openConfirm({
      title: '펫 신규 등록',
      content: '작성한 내용으로 등록하시겠습니까?',
      callback: async () => {
        closeConfirm();
        const result = await controller.myPetAdd(data);
        if(result.data.responseCode === 200) {
          openAlert({
            title: 'Mate Write Pet Add Success',
            type: 'success',
            content: '펫이 등록되었습니다.'
          });
          onClose();
        } else {
          openAlert({
            title: 'Mate Write Pet Add Error',
            type: 'error',
            content: '펫이 등록 중 오류가 발생하였습니다.\r\n새로 고침 후 다시 시도해주세요.'
          });
        }
      }
    });
  }

  return (
    <form className={style.wrapForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.wrapRow}>
        <h2>나의 펫 등록하기</h2>
      </div>
      <div className={style.wrapRow}>
        <div className={style.wrapCol}>
          <label htmlFor='petNameModal'>이름</label>
          <input 
            {...register('animalsName',
            {
              required: {value: true, message: '이름을 입력해주세요'},
            },
            )}
            id='petNameModal' type='text' placeholder='이름을 입력해주세요'
          />
          <p className={style.mateWriteWraning}>{errors.animalsName?.message}</p>
        </div>
      </div>

      <div className={style.wrapRow}>
        <div className={style.wrapCol + ' ' + style.wrapPetGender}>
          <label>성별</label>
          <input 
            {...register("animalsGender",
            {
              required: {value: true, message: '성별을 선택해주세요' }
            },
            )}
            type="radio" id='petGenderManModal' value="1"
          />
          <label htmlFor='petGenderManModal'>수컷</label>
          <input 
            {...register("animalsGender",
            {
              required: {value: true, message: '성별을 선택해주세요' }
            },
            )}
            type="radio" id='petGenderWomanModal' value="2"
          />
          <label htmlFor='petGenderWomanModal'>암컷</label>
          <p className={style.mateWriteWraning}>{errors.animalsGender?.message}</p>
        </div>
      </div>

      <div className={style.wrapRow}>
        <div className={style.wrapCol}>
          <label htmlFor='petAgeModal'>나이</label>
          <select
            {...register("animalsAge",
            { required: {value: true, message: '나이를 선택해주세요'}
            },
            )}
            id='petAgeModal'>
            <option value="선택">나이를 선택해주세요</option>
            <option value="0">알수없음</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          <p className={style.mateWriteWraning}>{errors.animalsAge?.message}</p>
        </div>
      </div>

      <div className={style.wrapRow}>
        <div className={style.wrapCol}>
          <label htmlFor='petSpeciesModal'>종류</label>
          <select
            {...register("animalsCategory1",
            { required: {value: true, message: '종류를 선택해주세요'}
            },
            )}
            id='petSpeciesModal'>
            <option value="선택">종류를 선택해주세요</option>
            <option value="1">강아지</option>
            <option value="2">고양이</option>
            <option value="3">기타</option>
          </select>
          <p className={style.mateWriteWraning}>{errors.animalsCategory1?.message}</p>
        </div>
      </div>

      <div className={style.wrapRow}>
        <div className={style.wrapCol}>
          <label htmlFor='petBreedsModal'>품종</label>
          <input 
            {...register('animalsCategory2',
            {
              required: {value: true, message: '품종을 입력해주세요'},
            },
            )}
            id='petBreedsModal' type='text' placeholder='품종을 입력해주세요'
          />
          <p className={style.mateWriteWraning}>{errors.animalsCategory2?.message}</p>
        </div>
      </div>

      <div className={style.wrapRow}>
        <div className={style.wrapCol + ' ' + style.wrapPetWeight}>
          <label htmlFor='petWeightModal'>무게</label>
          <input 
            {...register('animalsWeight',
            {
              required: {value: true, message: '무게를 입력해주세요'},
              pattern: {
                value: /^[0-9]{1,5}[.]{0,1}[0-9]{0,3}$/,
                message: '입력한 무게를 다시 확인해주세요'
              },
              min: {
                value: 0,
                message: '0이상의 숫자만 입력 가능합니다.'
              }
            },
            )}
            id='petWeightModal' type='text' placeholder='무게를 입력해주세요'
          />
          <span>KG</span>
          <p className={style.mateWriteWraning}>{errors.animalsWeight?.message}</p>
        </div>
      </div>

      <div className={style.wrapRow}>
        <div className={style.wrapCol + ' ' + style.wrapIsNeutered}>
          <label>중성화</label>
          <input 
            {...register("animalsNeutered",
            {
              required: {value: true, message: '중성화 여부를 선택해주세요' }
            },
            )}
            type="radio" id='isNeuteredTrueModal' value="1"
          />
          <label htmlFor='isNeuteredTrueModal'>예</label>
          <input 
            {...register("animalsNeutered",
            {
              required: {value: true, message: '중성화 여부를 선택해주세요' }
            },
            )}
            type="radio" id='isNeuteredFalseModal' value="2"
          />
          <label htmlFor='isNeuteredFalseModal'>아니오</label>
          <input 
            {...register("animalsNeutered",
            {
              required: {value: true, message: '중성화 여부를 선택해주세요' }
            },
            )}
            type="radio" id='isNeuteredUnknownModal' value="3"
          />
          <label htmlFor='isNeuteredUnknownModal'>모름</label>
          <p className={style.mateWriteWraning}>{errors.animalsNeutered?.message}</p>
        </div>
      </div>
      <div className={style.buttonGroup}>
        <button type='button' onClick={onClose as MouseEventHandler}>취소</button>
        <button type='button' onClick={handleSubmit(onSubmit)}>등록</button>
      </div>
    </form>
  )
}