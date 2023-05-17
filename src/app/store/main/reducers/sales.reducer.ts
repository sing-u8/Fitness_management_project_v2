import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'
import dayjs from 'dayjs'

// schemas
import { Loading } from '@schemas/loading'
import { StatsSales } from '@schemas/stats-sales'

import * as SaleActions from '@store/main/actions/sales.action'
