
import { createClient } from "./server";

export async function testSupabaseConnection() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("produtos")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Erro na conexão com Supabase:", error.message);
    return false;
  }

  console.log("Conexão com Supabase funcionando!", data);
  return true;
}
