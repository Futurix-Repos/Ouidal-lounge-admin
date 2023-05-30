import clientPromise from "@/db"
export default async function handler(req,res){
    try {
        const {searchTerm} = req.query
        const client = await clientPromise
        const ingredients = await client.db().collection('stockProducts').find({
            "sellingPerUnit.isTrue": true,
            "name": {
                $regex: searchTerm ? searchTerm : ".*",
                $options: "i",
            }
        }).toArray()

        res.send(ingredients)
    } catch (error:any) {
        console.log(error)
        res.status(500).send({msg:"Error"})
    }
}