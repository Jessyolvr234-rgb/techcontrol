
import { NextResponse } from "next/server";
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
          erro: error.message,
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
