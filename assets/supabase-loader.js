"use strict";
// La biblioteca solo se solicita cuando config.js tiene credenciales públicas.
// Así la demostración estática no depende de un CDN.
window.LIPA_getClient = (() => {
  let clientPromise;
  return () => {
    if(clientPromise)return clientPromise;
    const config=window.LIPA_CONFIG||{};
    if(!config.supabaseUrl||!config.supabasePublishableKey) return Promise.resolve(null);
    clientPromise=new Promise((resolve,reject)=>{
      if(window.supabase?.createClient){resolve(window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey));return}
      const script=document.createElement('script');
      script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.min.js';
      script.async=true;
      script.onload=()=>window.supabase?.createClient?resolve(window.supabase.createClient(config.supabaseUrl,config.supabasePublishableKey)):reject(Error('No se encontró el cliente Supabase.'));
      script.onerror=()=>{clientPromise=null;reject(Error('No se pudo descargar la biblioteca de Supabase.'))};
      document.head.append(script);
    });return clientPromise;
  }
})();
