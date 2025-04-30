//进行axios的二次封装，使用请求与响应拦截器
import axios from "axios";
//利用axios对象的create方法，创建axios实例（其它配置：基础路径、超时时间）


let request = axios.create({
    //baseUrl
    baseURL: 'http://192.168.3.99/eitapi/business/v3/l/plants/1/lines/65/equipments/1405/formulas/Eit',
  
});
/**
 * 异步获取数据
 * 
 * 本函数负责构建请求URL，并发起HTTP请求获取数据它接受起始位置、目的地、公式名称、响应数据数组和认证令牌作为参数
 * 主要功能包括：
 * 1. 根据提供的参数构建请求URL
 * 2. 发起HTTP请求并处理响应
 * 3. 成功时处理响应数据，失败时处理错误
 * 
 * @param from 起始位置标识符，用于构建请求URL
 * @param to 目的地标识符，用于构建请求URL
 * @param formulaName 公式名称，用于构建请求URL
 * @param responseDatas 响应数据数组，用于存储处理后的响应数据
 * @param token 认证令牌，用于请求中的身份验证
 * @returns 返回一个Promise，表示异步操作
 */

export function fetchData(from: string, to: string, formulaName: string, responseDatas: number[], token: string): Promise<void> {
    
    // const url = `/${formulaName}?from=${from}&to=${to}&timezone=Utc&token=${token}`;
    const url = `/${formulaName}?from=${from}&to=${to}&timezone=Utc`;

    return request.get(url,{  
        headers: {   
        'Authorization': `Bearer ${token}`   
    }})
        .then((respData) => {
            responseDatas.push(respData.data.result[0].value.displayValue.toFixed(0));

        })
        .catch((err) => {
            console.error(`Error fetching data for period ${from} to ${to}:`, err);
        });
}

//下边希望使用async await来做还是，但是这个返回的值可能成功，可能失败，调用它的时候还需要判断，不知道怎么写更好，暂时放弃
export async function fetchData1(from: string, to: string, formulaName: string,  token: string):Promise<number> {
    
    const url = `/${formulaName}?from=${from}&to=${to}&timezone=Utc`;
    try {
        let respData= await request.get(url,{  
            headers: {   
            'Authorization': `Bearer ${token}`   
        }});
        return respData.data.result[0].value.displayValue.toFixed(0);
    } catch (error) {
        console.error(`Error fetching data for period ${from} to ${to}:`, error);
        return -10000;  //
    }       
}