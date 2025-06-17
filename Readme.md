Este proyecto es una implementación moderna y robusta de una web para una tienda llamada "Indigo Creaciones", que ofrece una gran variedad de productos artesanales de la siguientes 4 categorias:
    1. Piezas de Yeso (piezas de yeso tales como budas, africanas, buhos, ganeshas, etc. pintadas y decoradas.).
    2. Velas (decorativas, aromaticas, etc).
    3. Piezas personalizadas (ajustadas al presupuesto y gusto de los clientes0).
    4. Otros.

La web debe constar de las siguientes paginas:
    1. Inicio
    2. Productos.
    3. Login administrativo.
    4. Panel administrativo.

A continuacion, nombrare cada pagina, especificando que debe contener y que funcion debe cumplir.

            INICIO:
- Debe tener un header con, logo y nombre de la tienda, menú de navegación, un botón de login y un carrito de compras. (El logo esta en el directorio public con el nombre "logo.webp").

- Un banner con una imagen y un texto "Descubre nuestra colección de piezas artesanales hechas con amor y dedicación" con un boton que rediriga a la pagina de los productos. (Esta imagen esta en el directorio public con el nombre "hero-banner.webp").

- Una seccion de categorias con las 4 categorias de productos. Cada categoria en una carta diferente bien diferenciadas. Al hacer click en alguna de las cartas, se redirigira a la pagina de productos, con el filtro correspondiente a la categoria aplicado.

- Una seccion de "Nuestro proceso" con un breve texto que diga "Conoce cómo creamos cada pieza artesanal" y tres cartas bien definidas y modernas que digan lo siguiente:
        1. Diseño: Cada pieza comienza con un diseño unico y cuidadosamente planificado.
        2. Elaboracion: Creamos cada pieza con materiales de primera calidad.
        3. Acabado: Cuidamos cada detalle para lograr un acabado perfecto.

- Una seccion de "Sobre nosotros" que diga lo siguiente:
                Sobre Nosotros
Conoce la historia detrás de nuestras creaciones
En Índigo Creaciones, nuestra pasión es crear piezas únicas que cuenten historias y embellezcan espacios. Cada pieza es elaborada con dedicación y amor por el detalle.
Nuestro compromiso es mantener vivas las técnicas artesanales tradicionales mientras incorporamos diseños contemporáneos que se adaptan a los gustos actuales.

- Una seccion de "Contacto ¿Tienes alguna pregunta? Estamos aquí para ayudarte" que debe contener dos cartas, bien diferenciadas con lo siguiente:
        1. En la primer carta, debe ser un formulario de contacto donde se pida ingresar Nombre, Email (opcional), Telefono, Asunto (con opciones Consulta general, Pieza personalizada, Informacion de envio, otro) y Mensaje. Este formulario se debe enviar como mensaje al correo indigo.creaciones76@gmail.com
        2. La segunda carta, debe contener la informacion de contacto. Direccion: Pedro Ferre 480, Bella Vista, Ctes, Argentina.
        Telefono: +54 9 3777 28-3023
        Email: indigo.creaciones76@gmail.com

- Por ultimo, un footer con el logo de la tienda, un menú de navegación, un enlace a la politica de privacidad y un enlace a la politica de cookies.


            PRODUCTOS:
- Debe contener el header, con los mismos componentes que la pagina del inicio. La unica diferencia es que el boton de navegacion "productos" no debe aparecer en esta pagina.

- Un sistema de filtros avanzados de productos con filtros por nombre, precio, categoria, etc. (Esto se debe hacer con un sistema de selectores)

- Un sistema de paginacion para mostrar los productos de manera ordenada y no sobrecargar la pagina.

- Texto que diga "Nuestros Productos
Descubre nuestra colección de artesanías únicas"

- Los productos deben estar organizados en tarjetas con la siguiente informacion:
        1. Nombre del producto.
        2. Imagenes del producto.
        3. Categoria del producto.
        4. Precio del producto.
        5. Boton de agregar al carrito.
        6. Boton de consultar por whatsapp. (Debe redirigir a un chat de whatsapp con el numero de contacto de la tienda, pidiendo informacion sobre el producto en cuestion)
Cada tarjeta solo mostrara una imagen del producto, la primera en cargarse.
Ademas, al hacer click en una tarjeta, se deslpegara un modal del producto clickeado con la siguiente informacion:
        1. Imagenes del producto.
        2. Nombre del producto.
        3. Categoria del producto.  
        4. Descripcion del producto.
        5. Precio del producto.
        6. Boton de agregar al carrito.
        7. Boton de consultar por whatsapp. (Debe redirigir a un chat de whatsapp con el numero de contacto de la tienda, pidiendo informacion sobre el producto en cuestion)


                LOGIN ADMINISTRATIVO:
- Header con el mismo estilo a las demas paginas, pero solo mostrando el logo y el nombre de la tienda. Al hacer click en cualquiera de los dos, rediriga al inicio.

- Debe ser un formulario de inicio de secion para el dueño de la tienda , donde se pida ingresar el usuario y la contraseña. Este formulario, al ingresar las credenciales correctas, redirige al panel de administracion con los permisos de administrador.
Las credenciales para este login seran las siguientes:
Usuario: IndigoCreaciones
Contraseña: Indigo.Creaciones@2025


                    PANEL ADMINISTRATIVO:
- Header con el mismo estilo a las demas paginas, pero solo mostrando el logo y el nombre de la tienda. Al hacer click en cualquiera de los dos, rediriga al inicio.

En este panel administrativo, se deberian poder agregar nuevos productos, editar los productos existentes y eliminar estos mismos.
Entonces debe contener lo siguiente:
- Un formulario para agregar nuevos productos con los siguientes campos:
        1. Nombre del producto.
        2. Categoria del producto.
        3. Descripcion del producto.
        4. Precio del producto.
        5. Imagenes del producto.
Las imagenes ingresadas, se convertiran automaticamente a .webp y almacenadas en el directorio /public/productos

- Un listado de los productos en forma de tabla, con los siguientes campos:
        1. Nombre del producto.
        2. Categoria del producto.
        3. Precio del producto.
        4. Boton de editar producto. (Las imagenes que no se cambien, permanecen en el producto).
        5. Boton de eliminar el producto. (Las imagenes que se eliminen, se eliminan del directorio /public/productos)

Los productos agregados/modificados/eliminados en este panel administrativo, se veran reflejados automaticamente en la pagina de productos.
El listado de productos sera guardado en una base de datos gratuita, para evitar que desaparezcan al reiniciar el servidor.


                CARRITO DE COMPRAS:
- Debe ser un modal, que funcione de la misma manera tanto en las paginas de inicio, como de productos.
- Al hacer click en el boton de agregar al carrito, se agregara el producto seleccionado.
- Cada producto agregado, tendra una opcion de - o + para aumentar o disminuir la cantidad y un boton de eliminar producto.
- Se debe incluir un boton de "vaciar carrito" que borre todos los productos en este.
- El carrito de compras, debe mostrar la cantidad total de productos y el precio total de los productos.
- Un boton de consultar por whatsapp que abrira un modal con el siguiente contenido:
Pregunta "¿El pedido sera con envio?"
Opcion 1: Si
Se desplegara un campo pidiendo ingresar el codigo postal.
Opcion 2: No

Y dos botones finales.
1. Cancelar (cerrara el modal de pregunta y volvera al modal del carrito.)
2. Confirmar. (redirigira a un chat de whatsapp al numero de contacto de la tienda con los datos del pedido, es decir, datos del carrito y del envio.)

Estas dos cosas (Carrito de compras y modal de envio) Deberan funcionar de la misma manera tanto en las paginas de inicio, como de productos.



La web debe ser moderna, con un diseño rustico y con un estilo de letra que sea legible y agradable a la vista.
La web debe ser accesible, es decir, debe cumplir con los estandares de accesibilidad.
La web debe ser segura, es decir, debe cumplir con los estandares de seguridad.
La web debe ser escalable, es decir, debe poder soportar un gran trafico de usuarios.
La web debe ser mantenible, es decir, debe ser facil de mantener y actualizar.
La web debe ser compatible con diferentes navegadores y sistemas operativos.
La web debe ser realizada con una paleta de colores marron terra que convine con los colores del banner.
La web debe tener un diseño de UI/UIX moderno y responsivo, que se adapte a diferentes dispositivos y tamaños de pantalla.
Accesibilidad y SEO avanzados.