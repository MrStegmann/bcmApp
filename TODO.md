# Pruebas Realizadas
Esto es una lista de cosas que hay que arreglar para la aplicación que se ha apreciado durante las pruebas en prod.
## Lista:
* Cuando se introduce información, el teclado se superpone al formulario. **Solución:** Mover el formulario hacia arriba para crear espacio entre el teclado y el formulario.
* El guardado de imagen es, practicamente, inexistente. **Solución:** Dejar solo la opción de Compartir y que desde ese apartado se elija si guardar o compartir.
* En rellenar los datos de un partido, los minutos de los jugadores no permite añadir segundos. Es decir, solo permite minutos enteros. **Solución:** Añadir la opción de añadir segundos.
* Al crear un nuevo equipo, crea dos equipos en lugar de uno: Uno con la categoría, otro sin la categoría. Y al eliminar los equipos, entra dentro de uno. **Solución:** Evitar la duplicidad de equipos y al eliminar un equipo, debe mantenerse en la lista de equipos.