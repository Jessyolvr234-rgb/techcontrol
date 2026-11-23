
import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produtos")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Erro Supabase:", error.message);

      return NextResponse.json(
        {
          conectado: false,
          erro: "Não foi possível consultar a tabela produtos. Verifique a URL do projeto, a chave pública e as políticas RLS.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      conectado: true,
      mensagem: "TechControl conectado ao Supabase!",
      produtosEncontrados: data.length,
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Erro inesperado:", error);

    return NextResponse.json(
      {
        conectado: false,
        erro: "Não foi possível conectar ao Supabase.",
      },
      { status: 500 }
    );
  }
}
