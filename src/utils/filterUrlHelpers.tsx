interface CasesFilters {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
}

const DEFAULTS: CasesFilters = {
  caseFilters: ["Accusative"],
  numberFilters: ["Singular"],
  definitenessFilters: ["Indefinite"],
  exemplarFilters: [5, 7, 1, 2, 11],
};

export function parseFiltersFromURL(searchParams: URLSearchParams): CasesFilters {
  const caseParam = searchParams.get('case');
  const numberParam = searchParams.get('number');
  const defParam = searchParams.get('def');
  const exParam = searchParams.get('ex');

  return {
    caseFilters: caseParam ? caseParam.split(',') : DEFAULTS.caseFilters,
    numberFilters: numberParam ? numberParam.split(',') : DEFAULTS.numberFilters,
    definitenessFilters: defParam ? defParam.split(',') : DEFAULTS.definitenessFilters,
    exemplarFilters: exParam ? exParam.split(',').map(Number).filter(n => !isNaN(n)) : DEFAULTS.exemplarFilters,
  };
}

export function serializeFiltersToURL(filters: CasesFilters): URLSearchParams {
  const params = new URLSearchParams();
  
  params.set('case', filters.caseFilters.join(','));
  params.set('number', filters.numberFilters.join(','));
  params.set('def', filters.definitenessFilters.join(','));
  params.set('ex', filters.exemplarFilters.join(','));
  
  return params;
}

export function getDefaultFilters(): CasesFilters {
  return { ...DEFAULTS };
}