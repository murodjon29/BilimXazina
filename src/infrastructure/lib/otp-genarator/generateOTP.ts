import { BadRequestException } from '@nestjs/common';
import { generate } from 'otp-generator';

export function generateOPT() {
  try {
    const otp = generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    return Number(otp);
  } catch (error) {
    throw new BadRequestException(`Error on generateOTP: ${error}`);
  }
}
