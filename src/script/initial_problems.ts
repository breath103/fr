import { Problem } from "../models";

const records = [
  {
    title: "1. 귀하의 성별은? *",
    choices: [
      { label: "남성", correct: 0 },
      { label: "여성", correct: 0 },
    ],
  },
  {
    title: "2. 귀하의 연령대는? *",
    choices: [
      { label: "19세 이하", correct: 0 },
      { label: "20~29세", correct: 0 },
      { label: "30~39세", correct: 0 },
      { label: "40~49세", correct: 0 },
      { label: "50~59세", correct: 0 },
      { label: "60세 이상", correct: 0 },
    ],
  },
  {
    title: "3. 귀하는 <당신의 문해력> 프로그램을 보셨습니까? *",
    choices: [
      { label: "시청했다", correct: 0 },
      { label: "시청하지 않았다", correct: 0 },
    ],
  },
  {
    title: "4. 귀하는 <당신의 문해력> 프로그램 내용이나 취지에 공감하십니까? *",
    choices: [
      { label: "공감하지 않는다", correct: 0 },
      { label: "보통이다", correct: 0 },
      { label: "공감한다", correct: 0 },
    ],
  },
  {
    title:
      "5. 귀하는 글을 읽고, 자신의 의견을 쓰는 데 어려움을 느낀 적이 있습니까? *",
    choices: [
      { label: "있다", correct: 0 },
      { label: "없다", correct: 0 },
    ],
  },
  {
    title:
      "6. 본인의 문해력(글을 읽고, 쓰는 능력)은 어느 정도라고 생각하십니까? *",
    choices: [
      { label: "매우 우수하다", correct: 0 },
      { label: "우수하다", correct: 0 },
      { label: "보통이다", correct: 0 },
      { label: "부족하다", correct: 0 },
      { label: "매우 부족하다", correct: 0 },
    ],
  },
  {
    title: "7. 사회 생활을 하는데 문해력이 필요하다고 생각하십니까? *",
    choices: [
      { label: "필요하다", correct: 0 },
      { label: "필요하지 않다", correct: 0 },
      { label: "잘 모르겠다", correct: 0 },
    ],
  },
  {
    title: "8. 문해력이 필요하다고 느끼는 순간이 있다면 언제입니까?  *",
    choices: [],
  },
  {
    title: "9. 문해력 향상에 무엇이 가장 필요하다고 생각하십니까? *",
    choices: [],
  },
  {
    title:
      "1. 다음은 의약품 설명서 중 일부입니다. 이를 읽고 이해한 내용으로 가장 적절한 것은? *",
    image:
      "https://lh4.googleusercontent.com/btXFmoblm0HhxJ3Y8To4tmTI29OJHFUKLZO3GaXGIxAJdnohVZqRZPqXrGVsLbmJ0wTEJun_NFrDwm8sINB-LQ5ICXPpBxyaBs7gIqbJvtqEHAmqzpI_7jYucmzeKwvlgw=w740",
    choices: [
      {
        label: "처방의의 지시가 없더라도 반드시 식후에 복용해야 한다",
        correct: 0,
      },
      {
        label: "복용 후에 발목이 갑자기 부으면 의사와 상의해야 한다.",
        correct: 1,
      },
      {
        label: "당뇨병 환자뿐만 아니라 심장병 환자도 복용할 수 있다.",
        correct: 0,
      },
      {
        label: "처방의의 판단에 따라 청소년 환자까지는 복용이 가능하다.",
        correct: 0,
      },
    ],
  },
  {
    title:
      "2. 다음은 근로기준법 규정 중 일부이다. (     ) 안에 들어갈 말로 가장 적절한 것은? *",
    image:
      "https://lh3.googleusercontent.com/2x0jMUCIAwLBh2bW5Rd_59DLNuKoOVVPqRCY52Qsdte-ChiqsfKMGeFSO7dxhLkgeejopDCqAVUrQrrhzqDrZam9DksUtrcCboZ2yUf1RUeDjmLNhkJlYrzJnS6u0gwfYA=w740",
    choices: [
      { label: "15", correct: 0 },
      { label: "16", correct: 0 },
      { label: "17", correct: 1 },
      { label: "18", correct: 0 },
    ],
  },
  {
    title:
      "3. 다음 견적서를 받은 XX 물산에서 선택사양을 선택하지 않고 구매할 때의 구매 금액은? *",
    image:
      "https://lh3.googleusercontent.com/XTl1Og3F6dvk3bSfwVPYGejJzafjulRqnIi3XCtofmGsyThDeVDZcu5T9XnReyo35sQpjvkxllIV-e7Z6pUpM2iFYRCdb4ujBUYyZ6SmA9g7j4xaUrivhR04NM89SbNWLw=w740",
    choices: [
      { label: "145만원", correct: 0 },
      { label: "147만원", correct: 0 },
      { label: "150만원", correct: 1 },
      { label: "152만원", correct: 0 },
    ],
  },
  {
    title:
      "4. 다음 글을 바탕으로, (   ) 안에 들어갈 말을 추론한 것으로 가장 적절한 것은? *",
    image:
      "https://lh5.googleusercontent.com/3-mTEjXsTJ75qhVk-BLmDYixsML69OSKGk-vlP4IdVEv5hI_C3T8mez7JZxRLL6tUlb3qkhqa8I5RSKTtJw0qKo_R_GHI2weKqLqna9_tUfC2gRyTUYpuDQcGt0vci0u2g=w740",
    choices: [
      {
        label: "정지신호 없이 정지하고 차량의 문을 열게 한 차량 운전자",
        correct: 1,
      },
      { label: "교통의 흐름을 고려하여 서행하지 않은 차량 운전자", correct: 0 },
      { label: "평소에 전방주시 의무를 소홀히 한 오토바이 운전자", correct: 0 },
      {
        label: "문이 열릴 가능성을 염두에 두지 않은 오토바이 운전자",
        correct: 0,
      },
    ],
  },
  {
    title:
      "5. 다음은 KTX 열차의 ‘다자녀 행복’ 할인 제도의 할인율을 설명한 내용이다. 두 중학생 자녀를 둔 부부가 이 할인 제도를 이용하여 ‘서울 – 부산’ 구간의 왕복 승차권을 구입할 때, 총 구매 금액은? *",
    image:
      "https://lh4.googleusercontent.com/UjapV4bkqLSN9UMGQ9Xy5WQtcCoLgvOR-h29opYgjj24zXTrjGxYleniBI-HbQXIsTboGJm8imk46zeP-7J-VDmRDBYiZsqCfOZ6Jx7UT4DiLiey0DCMP3wWozWIAFxKNw=w740",
    choices: [
      { label: "￦190,000", correct: 0 },
      { label: "￦224,000", correct: 0 },
      { label: "￦260,000", correct: 1 },
      { label: "￦284,000", correct: 0 },
    ],
  },
  {
    title: "6. 다음 중 ‘혼인 신고’에 대해 잘못 이해한 사람은? *",
    image:
      "https://lh5.googleusercontent.com/cuYO0IEndCHi2Wc37oBmZyL8g0JBKzrmKwrLqhMF6YTfrkJ2xb7iWyRjqIlZm-rtjIpaEQgqQiv_0V_nRlhbDoW7B5Kc_SwAOvkPnc1rMCYpWTPyv1KVo2cTUuqyBnLUGA=w740",
    choices: [
      {
        label:
          "A : 주민등록상 주소지가 아니어도 거주하는 지역의 동사무소에서도 가능하네.",
        correct: 1,
      },
      {
        label:
          "B : 결혼식을 올린 후뿐만 아니라 결혼식을 올리기 전에도 혼인신고를 할 수 있어.",
        correct: 0,
      },
      {
        label:
          "C : 신혼여행을 해외로 간 경우에도 그 나라의 영사관에서 혼인신고를 할 수 있구나.",
        correct: 0,
      },
      {
        label:
          "D : 부부 중 한 사람만 가서 신고해도 되지만, 배우자의 신분증을 가져가야 되는군.",
        correct: 0,
      },
    ],
  },
  {
    title:
      "7. 다음은 주택 임대차 계약 갱신 방법에 대한 설명이다. 이 설명에 의존할 때 ㄱ~ㄹ 중 ‘묵시의 갱신’을 할 수 있는 사례로 적절한 것은? *",
    image:
      "https://lh3.googleusercontent.com/xrYfsxPOIZ7k3v_zvwe6GR9zS7tbvk717bcPdZd6GL50t8wbCjCpkuzdSY3juSka0KHGWT81zBfR9SZ_C7lKQRvOu8UC9MTj9H_w3yvNwM-BioMbs4laYE-X9e0dywcjtw=w725",
    choices: [
      { label: "ㄱ", correct: 0 },
      { label: "ㄴ", correct: 0 },
      { label: "ㄷ", correct: 0 },
      { label: "ㄹ", correct: 1 },
    ],
  },
  {
    title:
      "9. 과학과 종교의 관계에 대한 아인슈타인의 견해를 추론한 것으로 가장 적절한 것은? *",
    image:
      "https://lh4.googleusercontent.com/W6iUzANEtsMIKnZaOwutD-V_S3Y0pjnOpezdL20q5JepGZsOWeGQdTCSsV9KJBFGQ4MTs4EH5NBXYUXzZkWx5d-2APYhSddNwOdRM-_8QYwkBnf1QGZDg7IkeDYJ0X3euQ=w740",
    choices: [
      { label: "상호 배타적", correct: 0 },
      { label: "상호 호혜적", correct: 0 },
      { label: "상호 보완적", correct: 1 },
      { label: "상호 모순적", correct: 0 },
    ],
  },
  {
    title:
      "10. 다음은 어떤 심리학 실험의 결과를 소개한 것이다. 이를 바탕으로 추론한 내용으로 가장 적절한 것은? *",
    image:
      "https://lh3.googleusercontent.com/LLdm--TAKunZpMO3QIpsboCKHJWRkBmEjqZ6WQPzVk5N_2wTe4rdyOpYyDayDrcDfFn1EGovFZv4xyfo3F2QE4Kbtn7zZAKbHhmDhHxbhf3YTfnwlo_xsf8n78H11Dya7g=w740",
    choices: [
      {
        label: "사람들은 독서의 과정에서 항상 합리적으로 사고한다.",
        correct: 0,
      },
      {
        label: "사람들은 독서를 통해 자신의 주관적 입장을 강화한다.",
        correct: 1,
      },
      {
        label: "사람들은 자신과 반대되는 입장의 글은 기억하지 않는다.",
        correct: 0,
      },
      {
        label: "사람들은 독서를 할 때 비논리적인 내용은 기억하지 않는다.",
        correct: 0,
      },
    ],
  },
  {
    title: "11. 다음 글의 (    ) 안에 들어갈 말로 가장 적절한 것은? *",
    image:
      "https://lh3.googleusercontent.com/nK8SwaiBvv9WEwvcQ7FLgV8APnCxMFXeQ0iQUIYYcQRCPiSkXFU9YgcBDPYEO2qWIoQTZtB5DZFPF3I0_dtMA7jtUUnyYb9MjvKJH853_cETsScvjxYue_kKemGKFv57xA=w740",
    choices: [
      { label: "의구심", correct: 0 },
      { label: "충동심", correct: 0 },
      { label: "호기심", correct: 1 },
      { label: "자부심", correct: 0 },
    ],
  },
];

import got from "got";
import * as S3 from "aws-sdk/clients/s3";

const client = new S3({});
async function uploadToS3(id: string, imageURL: string) {
  const res = await got.get(imageURL);

  const Key = `images/problems/${id}.png`;
  const image = await client.putObject({
    ACL: "public-read",
    Bucket: "fr-prod-store",
    Key,
    Body: res.rawBody,
    ContentType: res.headers["content-type"],
  }).promise();
  console.log(image);

  return `https://fr-prod-store.s3.ap-northeast-2.amazonaws.com/${Key}`;
}

async function main() {  
  for (const record of records) {
    if (record.image) {
      console.log("CREATING : ", JSON.stringify(record));
      const problem = await Problem.create({
        content: {
          type: "read-and-choose-v1",
          question: record.title,
          questionImage: record.image,
          choices: record.choices.map((choice) => choice.label),
          answerIndex: (record.choices.findIndex((choice) => choice.correct > 0))!,        
        },
      });
      problem.content.questionImage = await uploadToS3(problem.id, record.image);
      await problem.save();
      console.log("CREATING : ", JSON.stringify(problem));
    } else {
      continue;
    }
  }
}

main().then(console.log, console.log);