// const redis = require('redis');
const fs = require('fs');

const MateBoard = require('../models/MateBoard');
const CheckToken = require('../middleware/CheckToken');
const CurrentDate = require('../middleware/CurrentDate');

const {
  SingleFileHandler,
  MultiFileHandler,
} = require('../middleware/filehandler/MulterFileHandler');
const Animals = require('../models/Animals');
const Users = require('../models/Users');

/**
 * 게시글 작성 메서드
 * @description Mate 서비스 게시판의 글 작성 메서드
 * @param {*} request result를 제외한 아래 항목을 request.body로 받는다.
 * @param {String} mateBoardTitle 게시글 제목
 * @param {int} mateBoardFee 비용
 * @param {String} mateBoardContent1 본문
 * @param {String} mateBoardContent2 주의사항
 * @param {String} mateBoardPhotos 첨부 사진의 저장된 파일 이름
 * @param {int} mateBoardCategory 구인/구직 여부 구인=1, 구직=2
 * @param {String} mateBoardRegistDate 게시글 최초 작성일
 * (형태: yyyy-M-ddTHH:mm:s.ms)
 * @param {String} mateBoardModifyDate 게시글 최종 수정일
 * (형태: yyyy-M-ddTHH:mm:s.ms)
 * @param {BigInt} usersIndexNumber 작성자의 인덱스 번호
 * @param {BigInt} animalsIndexNumber 게시글과 연관된 반려동물의 인덱스 번호 
 * @param {*} result 메서드 결과를 전달하는 콜백함수
 */
exports.insertMateBoard = async (request, result) => {
  let inputToken = request.headers.token;
  let checkTokenResult = await CheckToken.CheckToken(1, inputToken);
  let currentTimeStamp = CurrentDate.CurrentTimeStamp();

  if(checkTokenResult.result == true) {
    
    let matePhotosList = new Array(request.files.length);
    
    for (let i = 0; i < request.files.length; i++) {
      matePhotosList[i] = request.files[i].filename;
    }

    let createMateBoard;

    if(request.body.animalsIndexNumber === null || request.body.animalsIndexNumber === undefined) {      
      createMateBoard = await MateBoard.create({
        mateBoardTitle: request.body.title,
        mateBoardFee: parseInt(request.body.amount),
        mateBoardContent1: request.body.detailContent,
        mateBoardContent2: request.body.cautionContent,
        mateBoardPhotos: matePhotosList.toString(),
        mateBoardCategory: parseInt(request.body.mateBoardCategory),
        mateBoardRegistDate: currentTimeStamp,
        mateBoardModifyDate: currentTimeStamp,
        usersIndexNumber: parseInt(request.body.usersIndexNumber)
      })
      .then(res => {
        if(res == null) {
          result.status(403).send({
            responseCode: 403,
            data: false,
            message: "게시글 등록 실패",
          });
        }
        else {
          result.status(200).send({
            responseCode: 200,
            data: true,
            message: "게시글 등록 완료"
          });
        }
      })
      .catch(err => {
        result.status(403).send({
          responseCode: 403,
          data: false,
          message: "게시글 등록 실패 데이터베이스 오류",
          error: err
        });
      })  
    } else {
      createMateBoard = await MateBoard.create({
        mateBoardTitle: request.body.title,
        mateBoardFee: parseInt(request.body.amount),
        mateBoardContent1: request.body.detailContent,
        mateBoardContent2: request.body.cautionContent,
        mateBoardPhotos: matePhotosList.toString(),
        mateBoardCategory: parseInt(request.body.mateBoardCategory),
        mateBoardRegistDate: currentTimeStamp,
        mateBoardModifyDate: currentTimeStamp,
        usersIndexNumber: parseInt(request.body.usersIndexNumber),
        animalsIndexNumber: parseInt(request.body.animalsIndexNumber),
      })
      .then(res => {
        if(res == null) {
          result.status(403).send({
            responseCode: 403,
            data: false,
            message: "게시글 등록 실패",
          });
        }
        else {
          result.status(200).send({
            responseCode: 200,
            data: true,
            message: "게시글 등록 완료"
          });
        }
      })
      .catch(err => {
        result.status(403).send({
          responseCode: 403,
          data: false,
          message: "게시글 등록 실패 데이터베이스 오류",
          error: err
        });
      })
    }
  } else {
    result.send({
      responseCode: 400,
      message: 'Incorrect Key',
    });
  }
};

/**
 * 모든 글 목록을 조회하는 함수  
 * 게시글 등록 날짜 기준 최신순으로 10개씩 출력합니다.
 * @param {*} request 
 * @param {*} result 
 */
exports.findAllMateBoard = async (request, result) => {
  let inputToken = request.headers.token;
  const checkTokenResult = await CheckToken.CheckToken(1, inputToken);

  if(checkTokenResult.result === true) {
    let pageNumber = request.params.pageNumber;
    let offset = 0;

    if(pageNumber > 1) {
      offset = 10 * (pageNumber - 1);
    }

    await MateBoard.findAll({
      // await MateBoard.findAndCountAll({ // .findAndCountAll() 사용시 결과값으로 rows 개수를 결과에 포함하여 출력한다.
      // attributes: ["animalsUsersIndexNumber"],
      include: [
        {
          model: Users,
          as: "Users",
          attributes: [ "account" ]
        }
      ],
      where: {
        mateBoardStatus: 1,
      },
      offset: offset,
      limit: 10,
      order: [['mateBoardRegistDate', 'DESC']],
    }).then((response) => {
      if (response == null) {
        result.send({
          responseCode: 304,
          message: 'no result',
        });
      } else {
        result.send({
          responseCode: 200,
          data: response,
        });
      }
    });
  } else {
    result.send({
      responseCode: 400,
      message: 'Incorrect Key',
    });
  }
};

/**
 * 사용자 색인번호를 매개변수로 글 목록을 조회하는 함수
 * @param {*} request 
 * @param {*} result 
 */
exports.findByUsersIndexNumber = async (request, result) => {
  let inputToken = request.headers.token;
  const checkTokenResult = await CheckToken.CheckToken(1, inputToken);

  if(checkTokenResult.result === true) {
    await MateBoard.findAll({
      // attributes: ["animalsUsersIndexNumber"],
      include: [
        {
          model: Users,
          as: "Users",
          attributes: [ "account" ]
        }
      ],
      where: {
        mateBoardStatus: 1,
        usersIndexNumber: request.params.usersIndexNumber,
      },
    }).then((response) => {
      if(response == null) {
        result.send({
          responseCode: 304,
          message: 'no result',
        });
      } else {
        result.send({
          responseCode: 200,
          data: response,
        });
      }
    });
  } else {
    result.send({
      responseCode: 400,
      message: 'Incorrect Key',
    });
  }
};

/**
 * 게시글 내부 에디터의 첨부파일을 위한 함수
 * @param {*} req 
 * @param {*} res 
 */
exports.textEditorImgFileUpload = (req, res) => {
  try {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data');
    }

    if (!fs.existsSync('./data/mateTextEditorImg')) {
      fs.mkdirSync('./data/mateTextEditorImg');
    }

    SingleFileHandler('mateTextEditorImg').single('imgFile')(
      req,
      res,
      (err) => {
        if (err) {
          console.log(err);
          res.status(400).send({ error: '파일 업로드 실패' });
        } else {
          const imgUrl = `http://localhost:3010/static/${req.file.filename}`;
          res.send({ imgUrl, fileName: req.file.filename });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: '텍스트 에디터 서버 오류' });
  }
};

/**
 * 게시글 상세 조회를 위한 메서드 (색인번호를 매개변수로 활용)
 * @param {*} request 
 * @param {*} result 
 */
exports.findByIndexNumber = async (request, result) => {
  let inputToken = request.headers.token;
  const checkTokenResult = await CheckToken.CheckToken(1, inputToken);

  if(checkTokenResult.result === true) {
    await MateBoard.findOne({
      // attributes: ["animalsUsersIndexNumber"],
      include: [
        {
          model: Animals,
          as: "Animals",
          attributes: [
            "animalsName", "animalsGender", "animalsNeutered",
            "animalsAge", "animalsWeight",
            "animalsCategory1", "animalsCategory2"
          ]
        },
        {
          model: Users,
          as: "Users",
          attributes: [ "account" ]
        }
      ],
      where: {
        mateBoardIndexNumber: request.params.mateBoardIndexNumber,
      }
    }).then((response) => {
      if(response == null) {
        result.status(404).send({
          responseCode: 404,
          data: null,
          message: 'no result',
        });
      } else {
        result.status(200).send({
          responseCode: 200,
          data: response,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      result.status(500).send({
        responseCode: 500,
        data: false,
        message: err
      });
    })
  } else {
    result.send({
      responseCode: 400,
      message: 'Incorrect Key',
    });
  }
};

/**
 * 게시글 수정을 위한 메서드
 * @param {*} request 
 * @param {*} result 
 */
exports.updateMateBoard = async (request, result) => {
  let inputToken = request.headers.token;
  let checkTokenResult = await CheckToken.CheckToken(1, inputToken);
  let currentTimeStamp = CurrentDate.CurrentTimeStamp();

  if(checkTokenResult.result == true) {
    
    let matePhotosList = new Array(request.files.length);
    
    for (let i = 0; i < request.files.length; i++) {
      matePhotosList[i] = request.files[i].filename;
    }

    let createMateBoard;

    if(request.body.animalsIndexNumber === null || request.body.animalsIndexNumber === undefined) {      
      createMateBoard = await MateBoard.update(
        {
          mateBoardTitle: request.body.title,
          mateBoardFee: parseInt(request.body.amount),
          mateBoardContent1: request.body.detailContent,
          mateBoardContent2: request.body.cautionContent,
          mateBoardPhotos: matePhotosList.toString(),
          mateBoardCategory: parseInt(request.body.mateBoardCategory),
          mateBoardModifyDate: currentTimeStamp,
          usersIndexNumber: parseInt(request.body.usersIndexNumber)
        },
        {
          where: {
            mateBoardIndexNumber: parseInt(request.body.mateBoardIndexNumber)
          }
        }
      )
      .then(res => {
        if(res == null) {
          result.status(403).send({
            responseCode: 403,
            data: false,
            message: "게시글 수정 실패",
          });
        }
        else {
          result.status(200).send({
            responseCode: 200,
            data: true,
            message: "게시글 수정 완료"
          });
        }
      })
      .catch(err => {
        result.status(403).send({
          responseCode: 403,
          data: false,
          message: "게시글 수정 실패 데이터베이스 오류",
          error: err
        });
      })  
    } else {
      createMateBoard = await MateBoard.update(
        {
          mateBoardTitle: request.body.title,
          mateBoardFee: parseInt(request.body.amount),
          mateBoardContent1: request.body.detailContent,
          mateBoardContent2: request.body.cautionContent,
          mateBoardPhotos: matePhotosList.toString(),
          mateBoardCategory: parseInt(request.body.mateBoardCategory),
          mateBoardModifyDate: currentTimeStamp,
          usersIndexNumber: parseInt(request.body.usersIndexNumber),
          animalsIndexNumber: parseInt(request.body.animalsIndexNumber),
        },
        {
          where: {
            mateBoardIndexNumber: parseInt(request.body.mateBoardIndexNumber)
          }
        }
      )
      .then(res => {
        if(res == null) {
          result.status(403).send({
            responseCode: 403,
            data: false,
            message: "게시글 수정 실패",
          });
        }
        else {
          result.status(200).send({
            responseCode: 200,
            data: true,
            message: "게시글 수정 완료"
          });
        }
      })
      .catch(err => {
        result.status(403).send({
          responseCode: 403,
          data: false,
          message: "게시글 수정 실패 데이터베이스 오류",
          error: err
        });
      })
    }
  } else {
    result.send({
      responseCode: 400,
      message: 'Incorrect Key',
    });
  }
};

/**
 * 게시글 삭제를 위한 메서드
 * @param {*} request 
 * @param {*} result 
 */
exports.deleteMateBoard = async (request, result) => {
  let inputToken = request.headers.token;
  let checkTokenResult = await CheckToken.CheckToken(1, inputToken);
  let currentTimeStamp = CurrentDate.CurrentTimeStamp();

  if(checkTokenResult.result == true) {
    console.log(request.body);
    await MateBoard.update(
        {
          mateBoardModifyDate: currentTimeStamp,
          mateBoardStatus: parseInt(3)
        },
        {
          where: {
            mateBoardIndexNumber: parseInt(request.body.mateBoardIndexNumber)
          }
        }
      )
      .then(res => {
        console.log(res);
        if(res[0] !== 1) {
          result.status(403).send({
            responseCode: 403,
            data: false,
            message: "게시글 삭제 실패",
          });
        }
        else {
          result.status(200).send({
            responseCode: 200,
            data: true,
            message: "게시글 삭제 완료"
          });
        }
      })
      .catch(err => {
        result.status(403).send({
          responseCode: 403,
          data: false,
          message: "게시글 삭제 실패 데이터베이스 오류",
          error: err
        });
      })  
  }
  else {
    result.send({
      responseCode: 400,
      message: 'Incorrect Key',
    });
  }
};