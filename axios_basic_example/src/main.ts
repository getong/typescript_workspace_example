import axios from 'axios';

const uuid = '123-123-123'

// async function test() {
//   const result = await axios.request({
//     method: 'post',
//     url: 'http://192.168.1.136:8092/Synapse',
//     timeout: 12000,
//     data: {
//     },
//     headers: {
//       'bt_header_dendrite_nonce': Date.now(),
//       'bt_header_dendrite_hotkey': '5E9oiir8aoPacwgM79RvNVHUh9SHUYtZcT8kRWnL4jCXM3Qm',
//       'bt_header_dendrite_uuid': uuid,
//       'computed_body_hash': 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a'
//     },
//   });
//   console.log(result.data);
// }

async function testSubquerySynapse() {
  const ping = 'ImhlbGxvIg==';
  const result = await axios.request({
    method: 'post',
    url: 'http://192.168.1.136:8092/SubquerySynapse',
    timeout: 12000,
    data: {
      ping: 'hello'
    },
    headers: {
      'bt_header_dendrite_nonce': Date.now(),
      'bt_header_dendrite_hotkey': '5E9oiir8aoPacwgM79RvNVHUh9SHUYtZcT8kRWnL4jCXM3Qm',
      'bt_header_dendrite_uuid': uuid,
      'computed_body_hash': 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a',
      'bt_header_input_obj_ping': ping,
    },
  });
  console.log(result.data);
}
testSubquerySynapse();
