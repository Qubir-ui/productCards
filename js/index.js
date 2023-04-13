const url = 'src/index.php'
const btn = document.querySelector('#showHide')
const list = document.querySelector('#cardContainer')
const form = document.querySelector('#form')

let items = []
let limit = 9
let amount = null
let shouldReset = false
let types = []
let inStock = false

const fetchData = async (limit) => {
    let str = `${url}/cards?&limit=${limit}`

    if (types.length > 0) {
        str += `&types=${types.join()}`
    }

    if (inStock) {
        str += `&inStock=1`
    }

    const res = await fetch(str)
    return await res.json()
}

const reset = () => {
    limit = 9
    btn.innerHTML = 'Показать еще'
    shouldReset = false
}

const btnHandler = async () => {
    if (shouldReset) {
        reset()
    } else {
        limit += 6
    }

    await render()
}

const generateCardListHtml = (items) => {
    let res = ''

    const findMarker = (marker) => {
        let hit = `
    <div class="absolute top-[15px] left-[15px] h-[14px] w-[85px] flex flex-row items-center gap-1 bg-[#A32018] px-2 text-white text-[8px] font-[Parangon] uppercase">
        <img src="img/star.svg" alt="star">
        Хит продаж
    </div>
    `
        let discount = `
    <div class="absolute top-[15px] left-[15px] h-[14px] w-[54px] flex flex-row items-center gap-1 bg-[#E0CD1C] px-2 text-white text-[8px] font-[Parangon] uppercase">
        <img src="img/discount.svg" alt="discount">
        Акция
    </div>
    `

        let news = `
    <div class="absolute top-[15px] left-[15px] h-[14px] w-[67px] flex flex-row items-center gap-1 bg-[#087A28] px-2 text-white text-[8px] font-[Parangon] uppercase">
        <img src="img/rocket.svg" alt="rocket">
        Новинка
    </div>
    `
        switch (marker){
            case "хит":
                return hit

            case "акция":
                return discount

            case "новинка":
                return news

            default:
                return ""
        }
    }

    let inStoke = `
    <div class="absolute right-[10px] bottom-[10px] px-[6px] pt-[3px] pb-[1px] flex flex-row items-center text-[#4F493F] text-[8px] bg-white">
        <img src="img/check.svg" alt="check" class="w-[9px] h-[9px] mr-[2px]">
        В наличии
    </div>
    `


    items.forEach(el => {
        if (el) {
            res += `
        <div class="flex min-[500px]:flex-row max-md:flex-col md:flex-col bg-[#EFF5F5] cursor-pointer">
          <div class="relative min-[500px]:mb-0 max-md:mb-[15px] md:mb-[15px] w-[260px] h-[260px] md:w-[290px] md:h-[290px] bg-card">
            ${findMarker(el.marker)}
            ${el["in_stock"] === "1" ? inStoke : ''}
          </div>
          <div class="flex h-full flex-col gap-[5px] mx-3 self-center">
            <span class="font-[Proxima_Nova] text-[#6E6659] text-[14px]">${el.type}</span>
            <span class="font-[Proxima_Nova] font-semibold text-[18px] text-[#264E58]">${el.name}</span>
            <div class="flex flex-row font-[Proxima_Nova] text-[#A5A5A5] text-[14px]">
              Артикул:<p class="ml-1 text-[#264E58]">${el.article}</p>
            </div>
            <div class="flex flex-row self-baseline items-baseline font-[Proxima_Nova] text-[#6E6659] text-[14px] pb-1">
              от:<p class="ml-1 mr-1 text-[#6E6659] text-[24px] font-bold">${el.price}</p>Р
            </div>
          </div>
        </div>
        `
        }
    })

    return res
}

const render = async () => {
    const data = await fetchData(limit)

    amount = data.amount
    items = data.items


    shouldReset = items.length >= amount && amount > 9

    list.innerHTML = generateCardListHtml(items)

    if (shouldReset) {
        btn.innerHTML = 'Показать меньше'
    }

    if (amount <= 9) {
        btn.style.display = 'none'
    } else {
        btn.style.display = 'block'
    }
}

(async () => {
    await render()
    btn.addEventListener('click', btnHandler)
    form.addEventListener('submit', async function(e) {
        e.preventDefault()

        const checkboxes = this.querySelectorAll('input');

        const map = {}

        checkboxes.forEach(el => {
            if (el.name) {
                map[el.value] = el.checked
            } else {
                inStock = el.checked
            }
        })

        types = Object.keys(map).filter(i => map[i])
        reset()

        await render()
    })
})()
