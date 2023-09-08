
'use client'
import { useState } from 'react';

function PhoneForm({ phonenum }) {
  const [phoneNumber, setPhoneNumber] = useState('010');

  function formatPhoneNumber(value) {
    let formattedPhoneNumber = value.replace(/\D/g, '');

    if (formattedPhoneNumber.length > 3) {
      formattedPhoneNumber = formattedPhoneNumber.substring(0, 3) + '-' + formattedPhoneNumber.substring(3);
      if (formattedPhoneNumber.length > 8) {
        formattedPhoneNumber = formattedPhoneNumber.substring(0, 8) + '-' + formattedPhoneNumber.substring(8);
      }
    }

    return formattedPhoneNumber;
  }

  function handlePhoneNumberChange(event) {
    const value = event.target.value;
    const formattedValue = formatPhoneNumber(value);

    // 최대 12자리까지 허용
    if (formattedValue.length <= 13) {
      setPhoneNumber(formattedValue);
      phonenum(formattedValue);
    }
  }

  return (
    <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="전화번호를 입력하세요" />
  );
}

export default PhoneForm;





