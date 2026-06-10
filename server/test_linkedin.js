

const token = 'AQU6c8vjLKv47C45oFO-8rm7H1pR5QxoP_1y74r0M5_Fce0j1sHOgVLse-cydj9Qapr9LZLSUzRCvLv3RRkLnLr5w5pwPNOxvw633KucBGlLIDjwIsUasQpZ7xb2hWFp6znDzZ2YvYIR5RqCZURIrpyZuarV9AQIjC5d4z9MdqeDwC7SzdjPye4CEgO8N0r-P_zv3_S5X2JlvrJfNssZbeAHFfybj-IXIeecT-q11vzkeYFoLIMXY9xl5VqcRBMVnSD8u6j2DUE0l1aln2sNai_m8bpR7O0JZp2Ad8WcCT_IA7lemZBybSpgd16G2mM-beXvHroAeh7NrqE2YiWB3mhEw6OeVg';

async function test() {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(response.status);
  console.log(await response.json());
}
test();
