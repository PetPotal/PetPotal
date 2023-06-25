const axios = require('axios');
const dotenv = require('dotenv');
const { json } = require('express');

dotenv.config({
  path: './config/.env',
});

// const geocodingUrl = '/api/map-geocode/v2/geocode';
const geocodingUrl = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";

const geocode = async(query) => {
  let result;  
  await axios.get(`${geocodingUrl}?query=${query}`, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': `${process.env.REACT_APP_NCP_MAP_CLIENT_ID}`,
        'X-NCP-APIGW-API-KEY': `${process.env.REACT_APP_NCP_MAP_CLIENT_SECRET}`,
      },
  })
  .then((res) => {
    // TODO: check if response is ok
    console.log('api 데이터 수신중');
    // console.log(res);
    // console.log(res.data);
    return res.data;
  })
  .then((data) => {
    if (data.addresses.length > 0) {
      console.log("검색 완료");
      result = {
        lat: data.addresses[0].x, 
        lng: data.addresses[0].y
      };
    } else if (data.addresses.length === 0) {
      console.log("검색 완료 결과가 0개 입니다.");
      result = {
        lat: -1, 
        lng: -1
      };
    } else {
      console.log("검색 완료3");
      // console.log('data ', data);
      result ={
        lat: data.addresses[0].x, 
        lng: data.addresses[0].y
      };
    }
  })
  .catch((error) => {
    console.log('api 요청 에러');
    console.error(error);
    result = {
      lat: -1,
      lng: -1
    };
  });
  return result;
};
  
// module.exports.geocoding = async (request, response) => {
//   // console.log('request.query ', request.query);
//   // console.log("request.query", request.param("query"));
//   axios.get(`${geocodingUrl}?query=${request.param("query")}`, {
//       headers: {
//         'X-NCP-APIGW-API-KEY-ID': `${process.env.REACT_APP_NCP_MAP_CLIENT_ID}`,
//         'X-NCP-APIGW-API-KEY': `${process.env.REACT_APP_NCP_MAP_CLIENT_SECRET}`,
//       },
//   })
//   .then((res) => {
//     // TODO: check if response is ok
//     console.log('api 데이터 수신중');
//     // console.log(res);
//     console.log(res.data);
//     return res.data;
//   })
//   .then((data) => {
//     if (data.addresses.length > 0) {
//       console.log(`${request.query}에는 여러 주소가 있어요.`);
//       response.status(200).send({
//         lat: data.addresses[0].x, lng: data.addresses[0].y
//       });
//     } else if (data.addresses.length === 0) {
//       console.log(`${request.query.address}에 해당되는 좌표가 없어요.`);
//       response.status(200).send({
//         lat: -1, 
//         lng: -1
//       });
//     } else {
//       // console.log('success but something wrong');
//       // console.log('data ', data);
//       response.status(200).send({
//         lat: data.addresses[0].x, 
//         lng: data.addresses[0].y
//       });
//     }
//   })
//   .catch((error) => {
//     console.log('api 요청 에러');
//     response.status(404).send({
//       data: false,
//     });
//   });

//   // return coord;
// };

module.exports = {
  geocode
}