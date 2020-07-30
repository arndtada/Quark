function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'fortune-hoe': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.enchantment.Enchantment',
                'methodName': 'func_92089_a', // canApply
                'methodDesc': '(Lnet/minecraft/item/ItemStack;)Z'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.IRETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "canFortuneApply",
                        "(Lnet/minecraft/enchantment/Enchantment;Lnet/minecraft/item/ItemStack;)Z",
                        ASM.MethodType.STATIC
                    ));
                    newInstructions.add(new InsnNode(Opcodes.IOR));
                    method.instructions.insertBefore(target, newInstructions);
                })
            }
        }
    }
}
