function calcularCuotaMensual(
  nroCuota,
  saldoCreditoUVAs,
  tasaMensual,
  plazoEnMeses,
  valorActualUVA
) {
  let cuotaMensualUVAs =
    (saldoCreditoUVAs * tasaMensual * Math.pow(1 + tasaMensual, plazoEnMeses)) /
    (Math.pow(1 + tasaMensual, plazoEnMeses) - 1);

  let cuotaMensualPesos = cuotaMensualUVAs * valorActualUVA;
  let saldoCreditoPesos = saldoCreditoUVAs * valorActualUVA;

  return {
    nroCuota: nroCuota,
    valorActualUVA: valorActualUVA.toFixed(2),
    cuotaMensualPesos: cuotaMensualPesos.toFixed(2),
    cuotaMensualUVAs: cuotaMensualUVAs.toFixed(2),
    saldoCreditoPesos: saldoCreditoPesos.toFixed(2),
    saldoCreditoUVAs: saldoCreditoUVAs.toFixed(2),
  };
}

function simularCreditoUVA(
  valorInicialUVA,
  valorInicialDolarMEP,
  plazoAnios,
  tasaNominalAnual,
  relacionCuotaIngreso,
  inflacionAnualEstimada,
  montoTotalCreditoPesos
) {
  const plazoEnMeses = plazoAnios * 12;
  const tasaMensual = tasaNominalAnual / 12 / 100;
  const inflacionMensualPromedio = 1 + inflacionAnualEstimada / 12 / 100;

  const montoTotalCreditoUVAs = montoTotalCreditoPesos / valorInicialUVA;
  const montoTotalCreditoUSD = montoTotalCreditoPesos / valorInicialDolarMEP;

  let cuotas = [];
  let saldoUVAs = montoTotalCreditoUVAs;
  let saldoMeses = plazoEnMeses;
  let uvaAjustadaIPC = valorInicialUVA;

  for (let i = 0; i < plazoEnMeses; i++) {
    let cuota = calcularCuotaMensual(
      i + 1,
      saldoUVAs,
      tasaMensual,
      saldoMeses,
      uvaAjustadaIPC
    );

    cuotas.push({ cuota });

    saldoUVAs = saldoUVAs - cuota.cuotaMensualUVAs;
    saldoMeses = saldoMeses - 1;
    uvaAjustadaIPC = uvaAjustadaIPC * inflacionMensualPromedio;
  }

  const ingresoMinimo =
    (cuotas[0].cuota.cuotaMensualPesos / relacionCuotaIngreso) * 100;

  return {
    valorInicialUVA: valorInicialUVA,
    valorInicialDolarMEP: valorInicialDolarMEP,
    plazoAnios: plazoAnios,
    tasaNominalAnual: tasaNominalAnual,
    relacionCuotaIngreso: relacionCuotaIngreso,
    inflacionAnualEstimada: inflacionAnualEstimada,
    montoTotalCreditoUVAs: montoTotalCreditoUVAs,
    montoTotalCreditoUSD: montoTotalCreditoUSD.toFixed(2),
    ingresoMinimo: ingresoMinimo,
    cuotas: cuotas,
  };
}

function mainProgram() {
  console.log("***** Simulador de creditos UVA *****");
  valorInicialUVA = parseFloat(
    prompt("Ingrese el valor actual de la UVA en pesos: ")
  );
  valorInicialDolarMEP = parseFloat(
    prompt("Ingrese el valor actual del Dolar MEP: ")
  );
  plazoAnios = parseFloat(prompt("Ingrese el plazo del credito en Años: "));
  tasaNominalAnual = parseFloat(
    prompt("Ingrese el porcentaje de la Tasa Nominal Anual: ")
  );
  relacionCuotaIngreso = parseFloat(
    prompt("Ingrese el porcentaje de relacion cuota/ingresos: ")
  );
  inflacionAnualEstimada = parseFloat(
    prompt("Ingrese el porcentaje de inflación estimada anual: ")
  );
  montoTotalCreditoUVA = parseFloat(
    prompt("Ingrese el monto Total del credito en Pesos: ")
  );

  const resultado = simularCreditoUVA(
    valorInicialUVA,
    valorInicialDolarMEP,
    plazoAnios,
    tasaNominalAnual,
    relacionCuotaIngreso,
    inflacionAnualEstimada,
    montoTotalCreditoUVA
  );
  console.log("El siguiente objeto contiene la simulación de su crédito UVA: ");
  console.log(resultado);
  alert("Simulación Finalizada. Presione F12 para visualizar la consola.");
  console.log("Simulación finalizada exitosamente. Muchas Gracias.");
}

mainProgram();

// Ejemplo de uso:
// Ingrese el valor actual de la UVA en pesos: 1350
// Ingrese el valor actual del Dolar MEP: 1194.47
// Ingrese el plazo del credito en Años: 20
// Ingrese el porcentaje de la Tasa Nominal Anual: 5.5
// Ingrese el porcentaje de relacion cuota/ingresos: 25
// Ingrese el porcentaje de inflación estimada anual: 2
// Ingrese el monto Total del credito en Pesos: 135000000
