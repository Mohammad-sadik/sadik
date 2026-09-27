const fs = require('fs');
let code = fs.readFileSync('src/components/Home.jsx', 'utf8');

code = code.replace("import React from 'react';", "import React, { useState } from 'react';");

code = code.replace(
  "const Home = () => {",
  "const Home = () => {\n  const [imgProps, setImgProps] = useState({ x: -10, y: 20, width: 500 });"
);

const oldImg = <motion.image 
              drag 
              onDragEnd={(e, info) => console.log("Final offset: x=", info.offset.x, "y=", info.offset.y)}
              style={{ cursor: 'grab' }}
              whileDrag={{ cursor: 'grabbing' }}
              className="home__blob-img" 
              x="-10" 
              y="20" 
              width="500" 
              href="/assets/img/perfil.png"
            />;

const newImg = <image 
              className="home__blob-img" 
              x={imgProps.x} 
              y={imgProps.y} 
              width={imgProps.width} 
              href="/assets/img/perfil.png"
            />;
code = code.replace(oldImg, newImg);

const debugUi = 
      {/* TEMP UI FOR IMAGE ALIGNMENT */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#fff', color: '#000', padding: '10px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Image Tweaker</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <button onClick={() => setImgProps(p => ({...p, x: p.x - 5}))}>X - 5</button>
          <button onClick={() => setImgProps(p => ({...p, x: p.x + 5}))}>X + 5</button>
          <button onClick={() => setImgProps(p => ({...p, y: p.y - 5}))}>Y - 5</button>
          <button onClick={() => setImgProps(p => ({...p, y: p.y + 5}))}>Y + 5</button>
          <button onClick={() => setImgProps(p => ({...p, width: p.width - 5}))}>Width - 5</button>
          <button onClick={() => setImgProps(p => ({...p, width: p.width + 5}))}>Width + 5</button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>
          x: {imgProps.x}, y: {imgProps.y}, w: {imgProps.width}
        </p>
      </div>
    </section>
;

code = code.replace("    </section>", debugUi);

fs.writeFileSync('src/components/Home.jsx', code);
console.log("Injected debug UI");
