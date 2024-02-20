# PreEntrega1RamirezPB-TS

Primera pre entrega del proyecto final del curso de Programación Backend de CoderHouse.

## Consigna

Se desarrollará un servidor que contenga los **endpoints** y servicios necesarios para gestionar los productos y carritos de compra en el **e-commerce**.

Desarrollar el servidor basado en **Node.js** y **Express.js**, que escuche en el **puerto 8080** y disponga de dos grupos de rutas: **/products** y **/carts**. Dichos **endpoints** estarán implementados con el **router** de **express**, con las siguientes especificaciones:

- Para el manejo de **productos**, los cuales tendrán su **router** en **/api/products/**, configurar las siguientes rutas:

  - En la ruta raíz (**/**) por **GET** se deberán listar todos los productos de la base (incluyendo la limitación **?limit** por **queries** del [desafío anterior](https://github.com/ianshalaga/Desafio3RamirezPB-TS)).

  - La ruta **/:pid** por **GET** deberá traer sólo el producto con el **id** proporcionado.

  - En la ruta raíz (**/**) por **POST** se deberá agregar un nuevo producto con los campos:

    - **id**: _Number_ o _String_ a elección. El **id** no se manda desde **body**, se autogenera, como lo hemos visto desde los primeros entregables, asegurando que nunca se repetirán los **ids** en el archivo.
    - **title**: _String_.
    - **description**: _String_.
    - **code**: _String_.
    - **price**: _Number_.
    - **status**: _Boolean_.
    - **stock**: _Number_.
    - **category**: _String_.
    - **thumbnails**: **array** de _Strings_ que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto.

  - **Status** es **true** por defecto.
  - Todos los campos son obligatorios, a excepción de **thumbnails**.

  - En la ruta **/:pid** por **PUT** se deberá tomar un producto y actualizarlo por los campos enviados desde **body**. **Nunca** se debe actualizar o eliminar el **id** al momento de hacer dicha actualización.

  - En la ruta **/:pid** por **DELETE** se deberá eliminar el producto con el **pid** indicado.

- Para los carritos, los cuales tendrán su **router** en **/api/carts/**, configurar dos rutas:

  - En la ruta raíz (**/**) por **POST** se deberá crear un nuevo carrito con la siguiente estructura:

    - **id**: _Number_ o _String_ a elección. De igual manera, como con los productos, se debe asegurar que nunca se dupliquen los **ids** y que estos se autogeneren.
    - **products**: **array** que contendrá objetos que representen a cada producto.

  - En la ruta **/:cid** por **GET** se deberán listar los productos que pertenezcan al carrito con el parámetro **cid** proporcionado.

  - En la ruta **/:cid/product/:pid** por **POST** se deberá agregar el producto al arreglo **products** del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:

    - **product**: sólo debe contener el **id** del producto (es crucial no agregar el producto completo).
    - **quantity**: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

  - Además, si un producto ya existente, intenta agregarse al carrito, incrementar el campo **quantity** de dicho producto.

- La persistencia de la información se implementará utilizando el **file system**, donde los archivos **products.json** y **carts.json**, respaldan la información.

- No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por **Postman** o por el cliente de tu preferencia.

## Entrega

Enlace al repositorio de **GitHub** con el proyecto completo, sin la carpeta de **node_modules**.

## dependencies

- `npm i express`

> **Express.js** es un **framework** minimalista y flexible para **Node.js** que simplifica el desarrollo de aplicaciones web y **APIs** al proporcionar características esenciales como enrutamiento, manejo de **middleware**, integración con motores de plantillas, gestión de errores, y más. Su enfoque modular y su extensibilidad permiten a los desarrolladores construir aplicaciones de manera rápida y eficiente, adaptándose a las necesidades específicas de sus proyectos. Express.js es ampliamente utilizado en la comunidad de **Node.js** debido a su facilidad de uso y su capacidad para construir aplicaciones web escalables y robustas.

## devDependencies

- `npm i nodemon -D`

> **Nodemon** reinicia automáticamente el servidor en cuanto detecta que hay cambios en el código.

- `npm i typescript -D` (Compilador de **TypeScript**)
- `npm i tsx -D` (Motor de ejecución de **TypeScript** para paquetes de tipo **module**)
- `npm i @types/node -D` (Definiciones de tipos de **TypeScript** para **Node.js**)
- `npm i @types/express -D` (Definiciones de tipos de **TypeScript** para **Express.js**)

## package.json

Se ubica en el directorio raíz.

- `"type": "module"`

> El proyecto utiliza módulos **ECMAScript** (**ESM**) en lugar de **CommonJS** para la gestión de módulos en **Node.js**. Permite utilizar la sintaxis de importación (**import**) y exportación (**export**) de **ECMAScript** estándar en lugar de la sintaxis **require** y **module.exports** de **CommonJS**.

## tsconfig.json

Se ubica en el directorio raíz. Se especifican las opciones de configuración para el compilador de **TypeScript**.

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "module": "ESNext"
  }
}
```

> - **"esModuleInterop": true**: **TypeScript** interpreta las importaciones predeterminadas (**import express from 'express'**) como si fueran importaciones de asignación (**import \* as express from 'express'**). Permite una mayor compatibilidad en las importaciones entre los diferentes estilos de exportación de módulos.
> - **"module": "ESNext"**: especifica el formato de módulo que se utilizará en la salida del compilador de **TypeScript**. **ESNext** indica que se utilizará el formato de módulo **ECMAScript** más reciente compatible con el entorno de ejecución.

## Ejecución

- **Scripts**: `tsx script.ts`.
- **Nodemon**: `nodemon --exec tsx script.ts`

## JSON Formatter

- [JSON Formatter](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa)

> Extensión para navegadores basados en Chromium.
