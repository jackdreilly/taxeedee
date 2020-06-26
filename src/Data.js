const data = {
  posts:'ABCDEFGHIJKLMNOPQRSTUV'.split('').map((id, i) => {
    return {
      id: id,
      photo: {
        url: i % 2 ? 'https://lh3.googleusercontent.com/OP4TG-_A7EKyxD6_TZTtz0lMN4DHdYBV9StQH58oTy3dqqXdMtlCgSMUABQj7CpMnQK3Ai7mGfJzjXugzsmAmJkGKgt__NrDesf_hOhhPorEDv-ZqI5bF_EnA2hXKXRVc-A-Y93cDMY=w600' : 'https://lh3.googleusercontent.com/prryPBhcCwseiLmXoYsKEXk1JtPW8AI7wEtIgTaHXf_aH36OL4xg52lDpj_9Yd2xBKo4GrC7GCXk_mRk4lEbGr2ek1ZCwnzLGIwEMEDlq-HIcuacVulyTZJSMjm9jE_8TTwGdmKozo0=w600',
      },
      title: 'Here is an actual title length ' + id,
      location: {
        city: 'City ' + id,
        country: 'Country ' + id,
      },
    };
  }),
};

export default data;