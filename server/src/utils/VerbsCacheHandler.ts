import { VerbsInCache } from './../interfaces';
import { VerbTime, VerbWithConjugations } from '../interfaces';
import HebrewConjugationsCacheStore from '../Models/VerbWithConjugation';
import { replaceNekudot } from './replace-nekudot';



export class VerbsCacheHandler {
      private notInCache: string[] = []
      private inCache: VerbWithConjugations[] = []

      constructor(
            private allVerbs: string[],
            private verbsInCache: Map<string, VerbWithConjugations>,
            private verbTimes: VerbTime[]

      ) {


            this.allVerbs.forEach(verb => {
                  const verbWithoutNekudot = replaceNekudot(verb);
                  if (this.verbsInCache.has(verbWithoutNekudot)) {
                        console.log(verb, 'IN CACHE')
                        console.log(verbWithoutNekudot, 'No NIKUDOT')
                        const verbFromCache = this.verbsInCache.get(verbWithoutNekudot)

                        if (verbFromCache && this.allTimesExistInVerb(verbTimes, verbFromCache)) {

                              this.inCache.push(verbFromCache)
                              return
                        }

                        this.notInCache.push(verb)
                        return
                  }
                  console.log(verb, 'NOT IN CACHE')
                  console.log(verbWithoutNekudot, 'No NIKUDOT')
                  this.notInCache.push(verb)
                  return

            });



      }

      get verbsFromCache(): VerbWithConjugations[] {
            return this.inCache
      }

      get verbsNotInCacheCache(): string[] {
            return this.notInCache
      }

      private allTimesExistInVerb(times: VerbTime[], verb: VerbWithConjugations): boolean {
            const PRESENT_CONJUGATION_QUANTITY = 5
            for (const time of times) {
                  if (!(time in verb)) {

                        return false
                  }

                  const currentConjugationQuantity = Object.keys(verb[time] || {}).length

                  if (currentConjugationQuantity === 0) return false;

                  if (time === 'present' && currentConjugationQuantity > PRESENT_CONJUGATION_QUANTITY) {
                        return false
                  }

            }

            return true

      }

      public updateVerbsCache(verbs: VerbWithConjugations[], verbsCache: VerbsInCache): void {
            verbs.forEach((verb) => {

                  verbsCache?.verbsInCache.set(replaceNekudot(verb.verb), verb)


            })
            HebrewConjugationsCacheStore.findOneAndUpdate({ _id: verbsCache?._id }, { verbsInCache: verbsCache?.verbsInCache })
                  .then();
      }

}