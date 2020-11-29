//new_chat_participant, left_chat_participant are deprecated

//124 invalid token

// {
//     user: {
//       id: 1222531322,
//       is_bot: false,
//       first_name: 'Hieu',
//       last_name: 'Dz',
//       language_code: 'en'
//     },
//     status: 'member'
//   }

// {
//     user: {
//       id: 1222531322,
//       is_bot: false,
//       first_name: 'Hieu',
//       last_name: 'Dz',
//       language_code: 'en'
//     },
//     status: 'left'
//   }

// {
//     payload: {
//       account_id: 'B6StMg1WS7K3nCKdSLTYlw',
//       object: {
//         uuid: 'clXccT4zR8C1MF/6EqF2Ag==',
//         participant: [Object],
//         id: '89621788001',
//         type: 5,
//         topic: 'hội thảo LOL chuyên nghiệp nhất vũ trụ',
//         host_id: 'FUr1m2ZpQDim0r14iB9Mag',
//         duration: 60,
//         start_time: '2020-09-22T09:00:48Z',
//         timezone: 'Asia/Bangkok'
//       }
//     },
//     event: 'webinar.participant_left'
//   }

// {
//     payload: {
//       account_id: 'B6StMg1WS7K3nCKdSLTYlw',
//       object: {
//         uuid: 'clXccT4zR8C1MF/6EqF2Ag==',
//         participant: [Object],
//         id: '89621788001',
//         type: 5,
//         topic: 'hội thảo LOL chuyên nghiệp nhất vũ trụ',
//         host_id: 'FUr1m2ZpQDim0r14iB9Mag',
//         duration: 60,
//         start_time: '2020-09-22T09:00:48Z',
//         timezone: 'Asia/Bangkok'
//       }
//     },
//     event: 'webinar.participant_joined'
//   }

// {
//     3|minar80  |   leave_time: '2020-09-26T10:07:20Z',
//     3|minar80  |   user_id: '16781312',
//     3|minar80  |   user_name: 'HieuDz HieuDz',
//     3|minar80  |   id: 'oALTNTbRQDOSXeD3wrwobw'
//     3|minar80  | }

//sample msg receive from bot.on message
// {
//   message_id: 103,
//   from: {
//     id: 1281341183,
//     is_bot: false,
//     first_name: 'Dat',
//     last_name: 'Thanh Nguyen',
//     language_code: 'en'
//   },
//   chat: {
//     id: -483832284, //-1001386682491
//     title: 'Webminar coin',
//     type: 'group',
//     all_members_are_administrators: true
//   },
//   date: 1600074174,
//   text: 'asdasd'
// }

// msg when add bot to other group
//{
//     message_id: 193,
//     from: {
//       id: 1281341183,
//       is_bot: false,
//       first_name: 'Dat',
//       last_name: 'Thanh Nguyen',
//       language_code: 'en'
//     },
//     chat: {
//       id: -440063103,
//       title: 'Jdd',
//       type: 'group',
//       all_members_are_administrators: true
//     },
//     date: 1600107525,
//     new_chat_participant: {
//       id: 1316284308,
//       is_bot: true,
//       first_name: 'Minarbot',
//       username: 'minar80_bot'
//     },
//     new_chat_member: {
//       id: 1316284308,
//       is_bot: true,
//       first_name: 'Minarbot',
//       username: 'minar80_bot'
//     },
//     new_chat_members: [
//       {
//         id: 1316284308,
//         is_bot: true,
//         first_name: 'Minarbot',
//         username: 'minar80_bot'
//       }
//     ]
//   }

//left chat
// {
//     message_id: 194,
//     from: {
//       id: 1281341183,
//       is_bot: false,
//       first_name: 'Dat',
//       last_name: 'Thanh Nguyen',
//       language_code: 'en'
//     },
//     chat: {
//       id: -440063103,
//       title: 'Jdd',
//       type: 'group',
//       all_members_are_administrators: true
//     },
//     date: 1600107597,
//     left_chat_participant: {
//       id: 877031285,
//       is_bot: false,
//       first_name: 'thu thiên',
//       last_name: 'thu thiên135'
//     },
//     left_chat_member: {
//       id: 877031285,
//       is_bot: false,
//       first_name: 'thu thiên',
//       last_name: 'thu thiên135'
//     }
//   }

//new chat participant or member
// {
//     message_id: 195,
//     from: {
//       id: 1281341183,
//       is_bot: false,
//       first_name: 'Dat',
//       last_name: 'Thanh Nguyen',
//       language_code: 'en'
//     },
//     chat: {
//       id: -440063103,
//       title: 'Jdd',
//       type: 'group',
//       all_members_are_administrators: true
//     },
//     date: 1600107653,
//     new_chat_participant: {
//       id: 877031285,
//       is_bot: false,
//       first_name: 'thu thiên',
//       last_name: 'thu thiên135'
//     },
//     new_chat_member: {
//       id: 877031285,
//       is_bot: false,
//       first_name: 'thu thiên',
//       last_name: 'thu thiên135'
//     },
//     new_chat_members: [
//       {
//         id: 877031285,
//         is_bot: false,
//         first_name: 'thu thiên',
//         last_name: 'thu thiên135'
//       }
//     ]
//   }

// left_chat_member {
//     message_id: 71,
//     from: {
//       id: 1390715758,
//       is_bot: false,
//       first_name: 'Quan',
//       last_name: 'Dep Zai',
//       language_code: 'en'
//     },
//     chat: { id: -1001386682491, title: 'Group of Gys', type: 'supergroup' },
//     date: 1600333491,
//     left_chat_participant: {
//       id: 1390715758,
//       is_bot: false,
//       first_name: 'Quan',
//       last_name: 'Dep Zai',
//       language_code: 'en'
//     },
//     left_chat_member: {
//       id: 1390715758,
//       is_bot: false,
//       first_name: 'Quan',
//       last_name: 'Dep Zai',
//       language_code: 'en'
//     }
//   }

// have new chat member {
//     message_id: 72,
//     from: {
//       id: 1390715758,
//       is_bot: false,
//       first_name: 'Quan',
//       last_name: 'Dep Zai',
//       language_code: 'en'
//     },
//     chat: { id: -1001386682491, title: 'Group of Gys', type: 'supergroup' },
//     date: 1600333528,
//     new_chat_participant: {
//       id: 1390715758,
//       is_bot: false,
//       first_name: 'Quan',
//       last_name: 'Dep Zai',
//       language_code: 'en'
//     },
//     new_chat_member: {
//       id: 1390715758,
//       is_bot: false,
//       first_name: 'Quan',
//       last_name: 'Dep Zai',
//       language_code: 'en'
//     },
//     new_chat_members: [
//       {
//         id: 1390715758,
//         is_bot: false,
//         first_name: 'Quan',
//         last_name: 'Dep Zai',
//         language_code: 'en'
//       }
//     ]
//   }
