import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'
import { ModelQueryBuilderContract, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export const queryHandle = async (
  query: ModelQueryBuilderContract<any>,
  validatedData: any,
  search?: any,
  columns?: string[]
): Promise<SimplePaginatorContract<any> | ModelPaginatorContract<any>> => {
  let _builder: any

  if (search && columns) {
    _builder = (builder: any): any => {
      for (const key of columns) {
        builder.orWhere(key, 'ILIKE', `%${String(search) || ''}%`)
      }
      return builder
    }
  } else {
    _builder = (builder: any) => {
      for (const key in validatedData.filter) {
        const element = validatedData.filter[key]
        typeof element === 'string'
          ? builder.where(key, 'ILIKE', `%${element || ''}%`)
          : builder.where(key, element)
      }
      return builder
    }
  }

  if (validatedData.order_column) {
    return await query
      .orderBy(validatedData.order_column, validatedData.order)
      .where(_builder)
      .paginate(validatedData.page ?? 1, validatedData.per_page ?? 10)
  } else {
    return await query.where(_builder).paginate(validatedData.page, validatedData.per_page)
  }
}

export const relatedHandle = async (
  models: SimplePaginatorContract<any>,
  relations?: string[]
): Promise<SimplePaginatorContract<any>> => {
  if (relations) {
    for (const m of models) {
      await m.load((loader) => {
        for (const r of relations) {
          loader.preload(r)
        }
      })
    }
  }
  return models
}
