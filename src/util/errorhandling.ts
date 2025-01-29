import { HttpException, HttpStatus } from "@nestjs/common";

const throwException =(error:any)=>
{
    throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error?.message,
      }, HttpStatus.BAD_REQUEST, {
        cause: error
      });
}

export {throwException}

