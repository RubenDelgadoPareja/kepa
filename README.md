# kepa

**Keep up.** Habit tracker local-first con buen diseño visual.

> Proyecto de portfolio — offline-first, sin login, sin servidor.  
> Datos guardados en IndexedDB directamente en el navegador.

Demo: [kepa-lyart.vercel.app](https://kepa-lyart.vercel.app)

---

## Características

- Hábitos **binarios** (hecho / no hecho) y **cuantitativos** (km, minutos, reps)
- Frecuencia **diaria** o **semanal** (N veces por semana)
- Meta opcional por hábito (valor + periodo)
- **Categorías** con color personalizable
- Soft delete: los hábitos se archivan, no se borran
- **Estadísticas**: racha actual, tasa de completado, calendario tipo GitHub
- Modo día / noche
- 100 % offline — sin cuenta, sin API externa

---

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + TypeScript 6 |
| Estilos | Tailwind CSS v4 |
| Estado | MobX 6 + mobx-react-lite |
| Persistencia | Dexie.js (IndexedDB) |
| Visualización | D3.js |
| Routing | React Router DOM 7 |
| Build | Vite 8 |
| Tests | Vitest 4 + Testing Library + jsdom |

---

## Arquitectura

Módulos independientes con **Clean Architecture**. Cada módulo sigue la misma estructura:

```
src/
├── core/                        # Código compartido entre módulos
│   └── presentation/
│       ├── hooks/               # useViewModel, useDidMount, useWillUnmount
│       └── view-models/base/    # BaseViewModel (MobX)
│
└── modules/
    ├── habits/
    │   ├── domain/              # Entidades, repositorios (interfaz), use cases
    │   ├── data/                # Implementaciones Dexie (data sources + repos)
    │   └── presentation/        # Pages, ViewModels, Components
    ├── tracking/                # Registro diario de entradas
    ├── stats/                   # Rachas, tasa de completado, calendario
    └── categories/              # Categorías con color
```

**Regla de dependencia:** `domain/` no importa nada externo. La DI es manual por constructores, sin contenedor IoC.

**Patrón ViewModel:** clases que extienden `BaseViewModel`, estado reactivo con MobX, conectadas a la vista con `useViewModel`.

---

## Inicio rápido

```bash
npm install
npm run dev
```

La app abre en `http://localhost:5173`.

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar el build |
| `npm test` | Tests en modo watch |
| `npm run test:run` | Tests una sola vez |
| `npm run test:coverage` | Cobertura de tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Convenciones

- **Archivos:** dot.case — `habit.entity.ts`, `create-habit.use-case.ts`, `habit.repository.impl.ts`
- **Tests:** `nombre.tipo.test.ts` junto al fichero que testean
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`)
