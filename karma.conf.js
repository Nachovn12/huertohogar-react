// karma.conf.js (En la raíz del proyecto)

module.exports = function(config) {
  config.set({
    // La base desde donde se resolverán las rutas relativas.
    basePath: '',

    // Frameworks de testing a usar
    frameworks: ['jasmine', 'webpack'],

    // Archivos y patrones a cargar en el navegador.
    files: [
      // --- CORRECCIÓN 1: Cargamos setupTests.js primero ---
      // Jest y React Testing Library necesitan ser configurados antes de las pruebas.
      'src/setupTests.js', 
      // Cargamos los archivos de prueba
      'src/**/*.test.js', 
      'src/**/*.test.tsx'
    ],

    // Archivos que deben ser preprocesados por Webpack (para transformar React/TS)
    preprocessors: {
      // --- CORRECCIÓN 2: Aseguramos que el setup y los tests se preprocesen ---
      'src/setupTests.js': ['webpack', 'sourcemap'],
      'src/**/*.test.js': ['webpack', 'sourcemap'],
      'src/**/*.test.tsx': ['webpack', 'sourcemap']
    },

    // --- CORRECCIÓN 3: Cargamos los plugins (incluyendo el HTML reporter) ---
    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-sourcemap-loader',
      'karma-html-reporter' // Nuevo plugin para reportes HTML
    ],


    // Configuración de Webpack para Karma
    webpack: {
        mode: 'development',
        module: {
            rules: [
                // Regla para transformar JS/JSX/TS/TSX con Babel
                {
                    test: /\.(ts|tsx|js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                ['@babel/preset-react', {"runtime": "automatic"}],
                                // Necesitas este preset para leer los archivos .tsx
                                '@babel/preset-typescript' 
                            ]
                        }
                    }
                },
                // Regla para ignorar o mockear archivos de estilos e imágenes (evita errores)
                {
                    test: /\.(css|less|sass|scss|png|jpg|gif|svg)$/,
                    // Usamos 'null-loader' para ignorar estos archivos en el test runner
                    loader: 'null-loader' 
                }
            ]
        },
        // Configuración para resolver extensiones de archivos (importaciones)
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        // Mapeo para el código fuente
        devtool: 'inline-source-map'
    },

    // Configuraciones adicionales de Karma
    reporters: ['progress', 'coverage', 'html'],
    
    // Configuración del reporte HTML
    htmlReporter: {
      outputDir: 'test-results', // Carpeta donde se guardará el reporte
      reportName: 'index', // Nombre del archivo (index.html)
      pageTitle: 'HuertoHogar - Resultados de Pruebas',
      subPageTitle: 'Testing con Jasmine y Karma - React + TypeScript',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: false,
      focusOnFailures: false,
      namedFiles: false,
      urlFriendlyName: true,
      preserveDescribeNesting: true,
      foldAll: false
    },
    
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false, // Deja esto en false para el modo "watch" con 'karma start'
    concurrency: Infinity
  });
};