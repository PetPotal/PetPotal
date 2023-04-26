const redis = require('redis');

const MateBoard = require('../models/MateBoard');
const CheckToken = require('../middleware/CheckToken');
const CurrentDate = require('../middleware/CurrentDate');

const { SingleFileHandler } = require('../middleware/MulterFileHandler');

exports.insertMateBoard = async (request, result) => {
  let inputToken = request.headers.token;
  let checkTokenResult = await CheckToken.CheckToken(
    1,
    request.headers.account,
    inputToken
  );
  let currentTimeStamp = CurrentDate.CurrentTimeStamp();

  if (checkTokenResult == true) {
    await MateBoard.create({
      mateBoardTitle: request.body.mateBoardTitle,
      mateBoardContent1: request.body.mateBoardContent1,
      mateBoardContent2: request.body.mateBoardContent2,
      mateBoardCategory: parseInt(request.body.mateBoardCategory),
      mateBoardRegistDate: currentTimeStamp,
      mateBoardModifyDate: currentTimeStamp,
      usersIndexNumber: parseInt(request.body.usersIndexNumber),
      animalsIndexNumber: parseInt(request.body.animalsIndexNumber),
    })
      .then((response) => {
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
      })
      .catch((error) => {
        if (error != null) {
          result.send({
            responseCode: 400,
            message: 'Something wrong...',
            error: error,
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

exports.findAllMateBoard = async (request, result) => {
  let inputToken = request.headers.token;
  const checkTokenResult = await CheckToken.CheckToken(
    1,
    request.headers.account,
    inputToken
  );

  if (checkTokenResult === true) {
    let pageNumber = request.params.pageNumber;
    let offset = 0;

    if (pageNumber > 1) {
      offset = 10 * (pageNumber - 1);
    }

    await MateBoard.findAll({
      // await MateBoard.findAndCountAll({ // .findAndCountAll() 사용시 결과값으로 rows 개수를 결과에 포함하여 출력한다.
      // attributes: ["animalsUsersIndexNumber"],
      // where: {
      //     usersIndexNumber: request.params.usersIndexNumber
      // }
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

exports.findByUsersIndexNumber = async (request, result) => {
  let inputToken = request.headers.token;
  const checkTokenResult = await CheckToken.CheckToken(
    1,
    request.headers.account,
    inputToken
  );

  if (checkTokenResult === true) {
    await MateBoard.findAll({
      // attributes: ["animalsUsersIndexNumber"],
      where: {
        usersIndexNumber: request.params.usersIndexNumber,
      },
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

exports.textEditorImgFileUpload = (req, res) => {
  try {
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
    res.status(500).send({ error: '서버 오류' });
  }
};
